import { Request, Response } from "express";
import AgentUserModel, { AgentUserProp } from "../model/AgentsUserModel";
import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import { ErrorMessage } from "../utils/ErrorMessage";
import { sendMail } from "../utils/SendMail";
import { ResponseMessage } from "../utils/ResponseMessage";
import NodeCache from "node-cache";
const cache = new NodeCache();
// create AgentsUsers
export const createAgentsUsers = async (
  req: any,
  res: Response
): Promise<void> => {
  const { password } = req.body;

  const hashPassword = await bcrypt.hash(password, 12);
  try {
    const data = await AgentUserModel.create({
      ...req.body,
      agent_id: req.user.agent_id,
      password: hashPassword,
    });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
  }
};

// get all AgentsUsers
export const getAllAgentsUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // i have exculded the password because i dont want to show it to the user side
    const data = await AgentUserModel.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
  }
};

// get single AgentsUsers
export const getSingleAgentsUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // i have exculded the password because i dont want to show it to the user side

    const data = await AgentUserModel.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!data)
      return res.status(400).json({
        status: "fail",
        message: "no data found with id " + req.params.id,
      });
    else {
      res.status(200).json({
        status: "success",
        data,
      });
    }
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error,
    });
  }
};

// update AgentsUsers
export const updateAgentsUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { password, role_id, f_name, l_name, mobile_no, email } = req.body;

  try {
    const data = await AgentUserModel.findByPk(req.params.id);
    if (!data)
      return ErrorMessage(res, "no data found with id " + req.params.id, 400);

    if (password) {
      const hashPassword = await bcrypt.hash(password, 12);
      const updateData = await AgentUserModel.update(
        { ...req.body, password: hashPassword },
        { where: { user_id: req.params.id } }
      );
    } else {
      const updateData = await AgentUserModel.update(
        { role_id, f_name, l_name, mobile_no, email },
        { where: { user_id: req.params.id } }
      );
    }

    res.status(200).json({
      status: "success",
      message: "data updated successfully",
    });
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error,
    });
  }
};

// update updateAgentsUserStatus
export const updateAgentsUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await AgentUserModel.findByPk(req.params.id);
    if (!data)
      res.status(400).json({
        status: "fail",
        message: "no data found with id " + req.params.id,
      });
    else {
      const updateData = await AgentUserModel.update(
        { status: req.body.status },
        {
          where: { user_id: req.params.id },
        }
      );
      res.status(200).json({
        status: "success",
        message: "Status updated successfully",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error,
    });
  }
};

// Delete AgentsUsers
export const deleteAgentsUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await AgentUserModel.findByPk(req.params.id);
    if (!data)
      return res.status(400).json({
        status: "fail",
        message: "no data found with id " + req.params.id,
      });
    else {
      const deleteData = await AgentUserModel.destroy({
        where: { user_id: req.params.id },
      });
      res.status(200).json({
        status: "success",
        message: "data deleted successfully",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error,
    });
  }
};

// login users
export const loginAgentUser = async (req: Request, res: Response) => {
  const { email, password }: AgentUserProp = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "please enter email or password " });
  }
  try {
    const user: any = await AgentUserModel.findOne({
      where: { email },
      // attributes:{exclude:['password']}
    });

    // UserAttributes
    if (!user)
      return res
        .status(400)
        .json({ status: "fail", message: "wrong credentials" });
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      return res
        .status(400)
        .json({ status: "fail", message: "wrong credentials" });

    // condition to login only active users
    if (!user?.dataValues.status)
      return ErrorMessage(res, "only active users allowed", 400);

    const token = jwt.sign(
      { email: user.email, id: user.user_id },
      process.env.SECRETE_KEY as string
    );

    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // let {user_id,role_id,agent_id,l_name,f_name}=user
    // we are extracting the password from the user object that is not gona be shown in the end point
    const userData = user.get({ plain: true }) as { [key: string]: any };
    delete userData.password; // Remove the password field from the user data
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ result: userData, token });
  } catch (error) {
    res.json({
      status: "failed",
      message: "some thing went wrong" + error,
    });
  }
};

// logOut users
export const LogOutAgentUser = (req: Request, res: Response) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.json({
    status: "success",
    message: "user logout success",
  });
};

export const getCookies = async (
  req: any,
  res: Response
): Promise<Response | void> => {
  // console.log('cookie', req.cookies);

  const { token } = req.cookies;
  try {
    if (!token) {
      return;
    }
    return res.json({
      user: req?.user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// forget password will send a Notification code to the email and will have 1 to 2 minuts for verification.
// after verication success redirect to new Password and Confirm Password

// forget password.
export const forgetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const findEmail = await AgentUserModel.findOne({
      where: { email: req.body.email },
    });
    if (!findEmail)
      return ErrorMessage(res, "no data found with given Email", 404);
    const value = Math.random().toString();
    const code = value.slice(value.length - 7, value.length - 1);
// this will store a code in cache for 120 seconds and then we will compare it with the sended code in email inside verficationCode() function
// cache.set("code",code)
cache.set("code",parseInt(code),60) //storing for 1 mnts
cache.set("user",(findEmail),240) //storing for 4 mnts

    sendMail(
      [req.body.email],
      "Password verifcation Code",
      `<p>your verication code is ${parseInt(code)}</p>`
    );

    ResponseMessage( res, 200, undefined, `verification code send to ${req.body.email}`
    );
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
}

// a verifcation code will be send to the email and verified
export const verificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const verifyCode=cache.get("code") as string
    
    // let user:AgentUserProp | undefined =cache.get("user")
    let user:any = cache.get("user")
    
 const token = jwt.sign(
  { email: user?.email, id: user?.user_id},
  process.env.SECRETE_KEY as string
);

const options = {
  expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

    if(parseInt(verifyCode)===parseInt(req.body.code)){
       res
      .status(200)
      .cookie("token", token, options)
      .json({ message: `Verification Successfully ${req.body.code}`, token ,id: user?.user_id });
    }else{
      ErrorMessage( res,  `Verification Failed with ${req.body.code}`,400)
    }
    
  } catch (error) {
    ErrorMessage(res, `token might be expired please send token again`, 400)
  }
};
