import { GlobalRequest } from "../types/custom";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import AgentComp, { AgentCompProps } from "../model/AgentCompModel";
import AgentUser from "../model/AgentsUserModel";
import UsersList from "../model/UserListModel";
import AgentUserModel from "../model/AgentsUserModel";
import { z } from "zod";
import { ValidationError } from "../utils/ValidationError";
import AccAccounts, { AccAcountsProps } from "../model/AccAccountsModel";
import { AgentGroupProps } from "../model/AgentGroupModel";
import { ErrorMessage } from "../utils/ErrorMessage";
import { checkValueExists } from "../utils/CheckValueExist";
import { ResponseMessage } from "../utils/ResponseMessage";
import { sendMail, transporter } from "../utils/SendMail";
import { pendingAgentMessage, deActivateAgencyMsg, ActivatePendingAgencyMsg, registerAgencyMsg, rejectPendingAgencyMsg } from "../config/EmailMessages";
import deleteImage from "../utils/DeleteImage";

// ******************************************************* Schemas *********************************************************
// creating a new agentCompany
export const createAgentCompSchema = z.object({
  agent_type: z.enum(["Travel Agent", "Corporate", "Consultant"]),
  auth_by: z.number(),
  manager: z.number(),
  agent_name: z.string(),
  agent_grp_id: z.number(),
  reg_no: z.string().optional(),
  tax_no: z.string().optional(),
  view_statement: z.enum([
    "Full Statement",
    "Only Total",
    "WithOut Discount/PSF",
  ]),
  logo_view: z.number(),
  tkt_auth: z.number(),
  hours_72: z.number(),
  address: z.string(),
  phone: z.string(),
  mobile_no: z.string(),
  user_email: z.string().email(),
  email: z.string().email(),
  url: z.string().url().optional(),
  f_name: z.string(),
  l_name: z.string(),
  password: z.string(),

});

// creating a new agentCompany
export const registerAgentCompSchema = z.object({
  agent_name: z.string(),
  reg_no: z.string().optional(),
  tax_no: z.string().optional(),
  address: z.string(),
  phone: z.string(),
  mobile_no: z.string(),
  user_email: z.string().email(),
  email: z.string().email(),
  url: z.string().url().optional(),
  f_name: z.string(),
  l_name: z.string(),
  password: z.string(),
});

export const updateAgentCompSchema = z.object({
  acc_id: z.number(),
  user_id: z.number(),
  agent_grp_id: z.number(),
  agent_type: z.enum(["Travel Agent", "Corporate", "Consultant"]),
  auth_by: z.number(),
  manager: z.number(),
  agent_name: z.string(),
  reg_no: z.string().optional(),
  tax_no: z.string().optional(),
  view_statement: z.enum([
    "Full Statement",
    "Only Total",
    "WithOut Discount/PSF",
  ]),
  address: z.string(),
  phone: z.string(),
  mobile_no: z.string(),
  url: z.string().optional(),
});

// update agent credit line schema
export const AgentCompCreditSchema = z.object({
  credit_limit: z.number().positive(),
  credit_used: z.number().positive(),
  limit_alert: z.number().positive(),
});

// ******************************************************* Controllers *********************************************************

// Register AgentComp this is for the agentComp when we create user and agentComp at the beggining before login
export const RegisterAgentComp = async (req: Request, res: Response) => {
  const body: AgentCompProps = req.body;
  const { f_name, l_name, user_mobile_no, user_email, password } = req.body;
  const validation = registerAgentCompSchema.safeParse(req.body);
  try {
    if (!validation.success) return ValidationError(validation, res);

    const userEmailExists = await checkValueExists(
      AgentUser,
      "email",
      user_email
    );
    if (userEmailExists) return ErrorMessage(res, "Email already exists", 400);

    const agentCom = await AgentComp.create({
      ...req.body,
      status: 3,
    });
    // now get the agentComp id and insert it to the user table;

    const hashPassword = await bcrypt.hash(password, 12);

    const userAgt = await AgentUser.create({
      agent_id: agentCom?.dataValues?.agent_id,
      role_id: 6,
      f_name,
      l_name,
      mobile_no: user_mobile_no,
      email: user_email,
      password: hashPassword,
      status: 0,
    });
    let teamName=await AgentComp.findOne({include:{model:AgentUser,where:{"role_id":1}}})

    let team:string | undefined =teamName?.dataValues.agent_name
    let address:string | undefined =teamName?.dataValues.address
    let mobile_no:string | undefined =teamName?.dataValues.mobile_no
    let email:string | undefined =teamName?.dataValues.email
    
    const comp_email=agentCom.dataValues.email as string

   ResponseMessage(res, 200, undefined, "agent data created successfully");
   
   sendMail([comp_email,email],`New Registration ${agentCom.dataValues.agent_name}`,registerAgencyMsg(agentCom.dataValues.agent_name,email,team,mobile_no,address))
  } catch (error: any) {
    ErrorMessage(res, error, 400);
  }
};

// update Register AgentComp this is for the agentComp when it is in pending form so this will change it to active agentCompany and create its accAccount.
export const updatePendingAgentComp = async (req: Request, res: Response) => {
  const {agent_name,user_email}=req.body
  try {
    const agentComp = await AgentComp.findByPk(req.params.id);
    if (agentComp?.dataValues.status!==3)
      return ErrorMessage(
        res,
        "Agent Company status is Not in Pending",
        400
      );

    const compData = await AgentComp.findByPk(req.params.id);
    if (!compData)
      return ErrorMessage(
        res,
        "Agent Company data Not found with id : " + req.params.id,
        400
      );
      const user = await AgentUser.findByPk(req.body.user_id);
      if (!user)
        return ErrorMessage(
          res,
          "User data Not found with id : " + req.body.user_id,
          400
        );
  
    const data: AccAcountsProps = {
      acc_level: 4,
      acc_parent: process.env.AGENTCOMP_ACC_PARRENT as number | undefined,
      acc_status: 1,
      acc_title: compData?.dataValues.agent_name,
      acc_nature: "SUBSIDIARY",
    };
    // counter
    let counter: number = 0;
    if (data.acc_parent) {
      counter =
        (await AccAccounts.count({ where: { acc_parent: data.acc_parent } })) +
        1;
      const parent = await AccAccounts.findByPk(data.acc_parent);
      data.acc_level_code = `${parent?.getDataValue(
        "acc_level_code"
      )}-${counter}`;
    } else {
      counter = (await AccAccounts.count({ where: { acc_parent: null } })) + 1;
      data.acc_level_code = `${counter}`;
    }

    const newLevel = await AccAccounts.create(data);

    const agentCom = await AgentComp.update(
      {
        ...req.body,
        acc_id: newLevel?.dataValues?.acc_id,
        add_edit_by: req.user?.user_id,
        status: 1,
      },
      { where: { agent_id: req.params.id } }
    );

    const userAgt = await AgentUser.update(
      {
        ...req.body,
        updated_by: req?.user?.user_id,
        status: 1,
      },
      { where: { user_id: req.body.user_id } }
    );

    // create separate function for this co it is used 4 times 
   let teamName=await AgentComp.findByPk(req.user?.agent_id)
   let team:string | undefined =teamName?.dataValues.agent_name
   let address:string | undefined =teamName?.dataValues.address
   let mobile_no:string | undefined =teamName?.dataValues.mobile_no
   let email:string | undefined =teamName?.dataValues.email
   
   const agent_email=agentComp.dataValues.email
   ResponseMessage(res, 200, undefined, "agent data updated successfully")
   sendMail([agent_email,email],`New Registration Confirmation ${agent_name}`,ActivatePendingAgencyMsg(agent_name,email,team,mobile_no,address,agent_email))
    // sendMail(req.body.email,pendingAgentMessage.subject,pendingAgentMessage.body)
  } catch (error: any) {
    ErrorMessage(res, error, 400)
  }
}

export const rejectPendingAgentComp=async(req:Request,res:Response)=>{
  const {id}=req.params
  try {
    const agent=await AgentComp.findByPk(id)

    if(!agent) return ErrorMessage(res,"agent not found with id : "+id,400)

    const deleteAgent=await AgentComp.destroy({where:{agent_id:id}})

    let teamName=await AgentComp.findByPk(req.user?.agent_id)
    let team:string | undefined =teamName?.dataValues.agent_name
    let address:string | undefined =teamName?.dataValues.address
    let mobile_no:string | undefined =teamName?.dataValues.mobile_no
    let email:string | undefined =teamName?.dataValues.email

    const comp_email=agent.dataValues.email
    const agent_name=agent.dataValues.agent_name

    sendMail([comp_email,email],`Agent’s Registration Rejected ${agent_name}`,rejectPendingAgencyMsg(agent_name,email,team,mobile_no,address))

   return ResponseMessage(res,200,undefined,"agent rejected with id :"+id)

  } catch (error) {
    return ErrorMessage(res,error,400)
  }
}

// get all AgentComp
export const getAllAgentComp = async (req: Request, res: Response) => {
  try {
    const data = await AgentComp.findAll({
      // join the tables
      include: [
        { model: AgentUser, attributes: { exclude: ["password"] } },
        { model: AccAccounts },
      ],
    });
    ResponseMessage(res, 200, data);
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// get all AgentCompUsers (these the users of a logged in agency admin)
export const getAllAgentCompUsers = async (req: Request, res: Response) => {
  try {
    const data = await AgentUserModel.findAll({
      where: { agent_id: req.user?.agent_id },
    });
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// get single AgentComp
export const getSingleAgentComp = async (req: Request, res: Response) => {
  try {  
    const data = await AgentComp.findByPk(req.params.id, {
      // join the tables
      include: [
        { model: AgentUser, attributes: { exclude: ["password"] } },
        { model: AccAccounts },
      ],
    });
    if(!data) return ErrorMessage(res,"agent not found with id : "+req.params.id,400)

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// create New AgentComp
export const createNewAgentComp = async (req: Request, res: Response) => {
  const body: AgentCompProps = req.body;
  const { role_id, f_name, l_name, user_mobile_no, user_email } = req.body;
  const validation = createAgentCompSchema.safeParse(req.body);
  try {
    if (!validation.success) return ValidationError(validation, res);

    const userEmailExists = await checkValueExists(
      AgentUser,
      "email",
      user_email
    );
    if (userEmailExists) {
      return ErrorMessage(res, "Email already exists.", 400);
    }
    // insert data into accounts table and get its acc_id and store it inside agentComp table
    const data: AccAcountsProps = {
      acc_level: 4,
      acc_parent: process.env.AGENTCOMP_ACC_PARRENT as number | undefined,
      acc_status: 1,
      acc_title: body.agent_name,
      acc_nature: "SUBSIDIARY",
    };
    // counter
    let counter: number = 0;
    if (data.acc_parent) {
      counter =
        (await AccAccounts.count({ where: { acc_parent: data.acc_parent } })) +
        1;
      const parent = await AccAccounts.findByPk(data.acc_parent);
      data.acc_level_code = `${parent?.getDataValue(
        "acc_level_code"
      )}-${counter}`;
    } else {
      counter = (await AccAccounts.count({ where: { acc_parent: null } })) + 1;
      data.acc_level_code = `${counter}`;
    }
    const newLevel = await AccAccounts.create(data);

    const agentCom = await AgentComp.create({
      ...req.body,
      acc_id: newLevel?.dataValues?.acc_id,
      add_by: req.user?.user_id,
      add_edit_by: req.user?.user_id,
    });
    // this is done with the second way
    const getAgentComId: any = await AgentComp.findOne({
      order: [["agent_id", "DESC"]],
    });
    // now get the agentComp id and insert it to the user table
    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);
    const userAgt = await AgentUser.create({
      agent_id: getAgentComId?.agent_id,
      role_id,
      f_name,
      l_name,
      mobile_no: user_mobile_no,
      email: user_email,
      password: hashPassword,
      updated_by: req?.user?.user_id,
    });

    // now get the agentComp id and userAgentId and insert it to the user_list table
    // const getUserId:any = await AgentUser.findOne({
    //   order: [["user_id", "DESC"]],
    // });

    // hold user list for now
    // // no i will get the agent id and also create a user and get the user id and then create it inside the user list
    // const userList = await UsersList.create({
    //   agent_id: getAgentComId?.agent_id,
    //   user_id: getUserId?.user_id,
    // });

    let teamName=await AgentComp.findByPk(req.user?.agent_id)
   let team:string | undefined =teamName?.dataValues.agent_name
   let address:string | undefined =teamName?.dataValues.address
   let mobile_no:string | undefined =teamName?.dataValues.mobile_no
   let email:string | undefined =teamName?.dataValues.email

   const comp_email=agentCom.dataValues.email
   const agent_name=agentCom.dataValues.agent_name

   sendMail([comp_email,email],`New Registration Confirmation ${agent_name}`,ActivatePendingAgencyMsg(agent_name,email,team,mobile_no,address,comp_email))
   
   ResponseMessage(res, 200, undefined, "agent data created successfully");
    
  } catch (error: any) {
    ErrorMessage(res, error, 400);
  }
};

// update New AgentComp
export const updateNewAgentComp = async (req: Request, res: Response) => {
  const body: AgentCompProps = req.body;
  const { user_id, acc_id, mobile_no, email, role_id, f_name, l_name } =
    req.body;
  const validation = updateAgentCompSchema.safeParse(req.body);
  try {
    if (!validation.success) return ValidationError(validation, res);

    // const userEmailExists = await checkValueExists(
    //   AgentUser,
    //   "email",
    //   user_email
    // )
    // if (userEmailExists) {
    //   return ErrorMessage(res, "Email already exists.", 400)
    // }

    // checking if the 3 tables exists are not
    const agent = await AgentComp.findByPk(req.params.id);
    const user = await AgentUserModel.findByPk(user_id);
    const accAccount = await AccAccounts.findByPk(acc_id);

    if (!accAccount)
      return ErrorMessage(res, "no Account data found with id " + acc_id, 400);
    if (!user)
      return ErrorMessage(res, "no User data found with id " + user_id, 400);
    if (!agent)
      return ErrorMessage(
        res,
        "no Agent data found with id " + req.params.id,
        400
      );

    // update accAccount table
    await AccAccounts.update(
      { acc_title: req.body.agent_name },
      { where: { acc_id: acc_id } }
    );

    // update agentComp table
    await AgentComp.update(
      {
        ...req.body,
        add_edit_by: req.user?.user_id,
        add_edit_datetime: new Date(),
      },
      { where: { agent_id: req.params.id } }
    );

    // update agentUser table

    if (req.body.password) {
      const hashPassword = await bcrypt.hash(req.body.password, 12);
      const updateData = await AgentUserModel.update(
        {
          ...req.body,
          password: hashPassword,
          updated_by: req?.user?.user_id,
          updated_at: new Date(),
        },
        { where: { user_id: user_id } }
      );
    } else {
      const updateData = await AgentUserModel.update(
        {
          role_id,
          f_name,
          l_name,
          mobile_no,
          email,
          updated_by: req?.user?.user_id,
          updated_at: new Date(),
        },
        { where: { user_id: user_id } }
      );
    }

    ResponseMessage(
      res,
      200,
      undefined,
      "data updated successfully with id : " + req.params.id
    );
  } catch (error: any) {
    ErrorMessage(res, error, 400);
  }
};

// // update AgentComp this is for the agency inside agancy data and the agency is the main admin agency edit
export const updateMainAgency = async (req: any, res: Response) => {

  let logo=req?.files?.['logo']?.[0]?.filename
  let bg_image=req?.files?.['bg_image']?.[0]?.filename
  let fav_icon=req?.files?.['fav_icon']?.[0]?.filename
  let sitePreloader=req?.files?.['sitePreloader']?.[0]?.filename
  let searchPreloader=req?.files?.['searchPreloader']?.[0]?.filename
  
 
  const { f_name, l_name, mobile_no, user_id, acc_id, agent_name ,comp_email,user_email } =
    req.body;

  try {
    // checking if the 3 tables exists are not
    const agent = await AgentComp.findByPk(req.params.id);
    const user = await AgentUserModel.findByPk(user_id);
    const accAccount = await AccAccounts.findByPk(acc_id);

    if (!accAccount)
      return ErrorMessage(res, "Account data not found with id " + acc_id, 400)
    if (!user)
      return ErrorMessage(res, "User data not found with id " + user_id, 400)
    if (!agent)
      return ErrorMessage(
        res,
        "Agent data not found with id " + req.params.id,
        400
      )
    // update accAccount table
    await AccAccounts.update(
      { acc_title: agent_name },
      { where: { acc_id: acc_id } }
    )

const logoImg= await AgentComp.findByPk(req.params.id) 
    const data = await AgentComp.update(
      {
        add_edit_by: req.user?.user_id,
        add_edit_datetime: new Date(),
        logo: logo,
        // logo: req.files?.logo===undefined ? logoImg?.dataValues.logo : logo,
        sitePreLoader: searchPreloader,
        bg_image: bg_image,
        fav_icon: fav_icon,
        email:comp_email,
        searchPreLoadder: sitePreloader,
        ...req.body,
      },
      { where: { agent_id: req.params.id } }
    );

    if (req.body.password) {
      const hashPassword = await bcrypt.hash(req.body.password, 12);
      const updateData = await AgentUserModel.update(
        {
          ...req.body,
          password: hashPassword,
          updated_by: req?.user?.user_id,
          updated_at: new Date(),
        },
        { where: { user_id: user_id } }
      );
    } else {
      const updateData = await AgentUserModel.update(
        {
          f_name,
          l_name,
          mobile_no,
          email:user_email,
          updated_by: req?.user?.user_id,
          updated_at: new Date(),
        },
        { where: { user_id: user_id } }
      );
    }
    ResponseMessage(res, 200, undefined, "data updated successfully");
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// update AgentComp Credit line
export const updateAgentCompCreditLine = async (
  req: Request,
  res: Response
) => {
  const validation = AgentCompCreditSchema.safeParse(req.body);

  try {
    if (!validation.success) return ValidationError(validation, res);

    const findAgent = await AgentComp.findByPk(req.params.id);
    if (!findAgent) return ErrorMessage(res, "no data found", 400);
    // we just need to update the 3 values only
    const data = await AgentComp.update(
      {
        credit_limit: req.body.credit_limit,
        credit_used: req.body.credit_used,
        limit_alert: req.body.limit_alert,
      },

      { where: { agent_id: req.params.id } }
    );
    ResponseMessage(res, 200, undefined, "data updated successfully");
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// update AgentComp Status
export const updateAgentCompStatus = async (req: Request, res: Response) => {
  try {
    const findAgent = await AgentComp.findByPk(req.params.id);
    if (!findAgent) return ErrorMessage(res, "no data found", 400);

    const data = await AgentComp.update(
      { status: req.body.status },
      { where: { agent_id: req.params.id } }
    );

    
    let teamName=await AgentComp.findByPk(req.user?.agent_id)
    let team:string | undefined =teamName?.dataValues.agent_name
    let address:string | undefined =teamName?.dataValues.address
    let mobile_no:string | undefined =teamName?.dataValues.mobile_no
    let email:string | undefined =teamName?.dataValues.email
    
    const comp_email=findAgent.dataValues.email as string

  if(req.body.status==1){
    sendMail([comp_email,email],`Agent’s Registration Activated ${findAgent.dataValues.agent_name}`,ActivatePendingAgencyMsg(findAgent.dataValues.agent_name,email,team,mobile_no,address,comp_email))
  }else if(req.body.status==0){
    sendMail([comp_email,email],`Agent’s Registration De-Activated ${findAgent.dataValues.agent_name}`,deActivateAgencyMsg(findAgent.dataValues.agent_name,email,team,mobile_no,address))
  }
    ResponseMessage(res, 200, undefined, "status updated successfully");
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};
