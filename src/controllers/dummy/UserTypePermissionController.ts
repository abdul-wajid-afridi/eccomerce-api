import { Request, Response } from "express";
import { ErrorMessage } from "../utils/ErrorMessage";
import UserTypePermission, {
  UserTypePermissionProps,
} from "../model/UserTypePermissionModel";
import { ResponseMessage } from "../utils/ResponseMessage";
import { z } from "zod";
import { ValidationError } from "../utils/ValidationError";
import PageLevel from "../model/PageLevelModel";
import RoleModel from "../model/RoleModel";
import AgentUsers, { AgentUserProp } from "../model/AgentsUserModel";
import UserPermission from "../model/UserPermissionModel";

const userTypePermission = z.object({
  user_type_id: z.number(),
  page_level_id: z.number(),
});

// NOTE userTypePermission is rolePermissions
// get all UserTypePermission is Role Permission
export const getAllUserTypePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await UserTypePermission.findAll({
      include: [
        // in this table the usertype id mean role_id which is changed by sir
        { model: RoleModel, attributes: ["role_id", "role_name"] },
        {
          model: PageLevel,
          attributes: ["id", "permission_name", "permission_url"],
        },
      ],
    });
    ResponseMessage(res, 200, data);
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// get single UserTypePermission
export const getSingleUserTypePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const data = await UserTypePermission.findByPk(id, {
      include: [
        // in this table the usertype id mean role_id which is changed by sir
        { model: RoleModel, attributes: ["role_id", "role_name"] },
        {
          model: PageLevel,
          attributes: ["id", "permission_name", "permission_url"],
        },
      ],
    });
    if (!data) return ErrorMessage(res, "no data found with id : " + id, 400);
    ResponseMessage(res, 200, data);
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// create UserTypePermission
export const createUserTypePermission = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user_type_id, page_level_id } = req.body;
  const body: UserTypePermissionProps = req.body;
  try {
    const isValid = userTypePermission.safeParse(body);
    // this will check if we give permission so it will give but if the value come back again that will check and delete the data
    const findRole = await UserTypePermission.findOne({where: { user_type_id, page_level_id }});
    const find = await AgentUsers.findAll({where: { role_id:user_type_id, }});
    
    if (findRole) {
      findRole.destroy();
      (find.map(async(it:any)=>{
        //  const findData= await UserPermission.findOne({where:{user_id:it?.user_id,page_level_id}})
         const findData= await UserPermission.findAll({where:{user_id:it?.user_id,page_level_id}})
        //  to destroy each use which exist in user permision of that role which we denied its permission
        findData.map(it=>it.destroy())
          // findData?.destroy()
         }))
      return ResponseMessage(res, 200,undefined, "permission dinied");
    }

   (find.map(async(it:any)=>{
   return  await UserPermission.create({user_id:it?.user_id,page_level_id})
    }))
    
    if (!isValid.success) return ValidationError(isValid, res)
    const data = await UserTypePermission.create(req.body)
    return ResponseMessage(res, 200, data)
  } catch (error) {
    return ErrorMessage(res, error, 400);
  }
};

// update UserTypePermission
export const updateUserTypePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const data = await UserTypePermission.findByPk(id);
    if (!data) return ErrorMessage(res, "no data found with id : " + id, 400);
    const updateData = await UserTypePermission.update(
      { ...req.body },
      { where: { id } }
    );
    ResponseMessage(
      res,
      200,
      undefined,
      "data updated successfully with id :" + id
    );
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// find a user role permisions if exists then return the data else return null
export const findUserTypePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await UserTypePermission.findOne({
      where: { user_type_id: req.body.user_type_id },
      include: {
        model: PageLevel,
        where: { permission_url: req.body.permission_url },
        attributes: ["permission_name", "permission_url"],
      },
    });
    // const data=await UserTypePermission.findOne({where:{user_type_id:req.body.user_type_id , page_level_id:req.body.page_level_id}})
    if (!data) return ErrorMessage(res, "no data found", 200);
    ResponseMessage(res, 200, data, "this is your data");
  } catch (error) {
    ErrorMessage(res, error, 400);
  }
};

// // find a user role permisions if exists then return the data else return null
// export const findUserTypePermission=async(req:Request,res:Response):Promise<void>=>{
//     try {
//         const data=await UserTypePermission.findOne(
//             {where:{user_type_id:req.body.user_type_id},
//             include:{model:PageLevel,where:{permission_url:req.body.permission_url},
//             attributes:["permission_name","permission_url"]}})
//         // const data=await UserTypePermission.findOne({where:{user_type_id:req.body.user_type_id , page_level_id:req.body.page_level_id}})
//         if(!data) return ErrorMessage(res,"no data found",200)
//         ResponseMessage(res,200,data,"this is your data")
//     } catch (error) {
//         ErrorMessage(res,error,400)
//     }
// }
