import { Request, Response } from "express";
import { ErrorMessage } from "../utils/ErrorMessage";
import UserPermission, { UserPermissionProps } from "../model/UserPermissionModel";
import { ResponseMessage } from "../utils/ResponseMessage";
import { z } from "zod";
import { ValidationError } from "../utils/ValidationError"
import AgentUser from "../model/AgentsUserModel";
import PageLevel from "../model/PageLevelModel";

const userPermission = z.object({
    user_id: z.number(),
    page_level_id: z.number()
})

// NOTE userPermission is rolePermissions
// get all UserPermission is Role Permission
export const getAllUserPermission=async(req:Request,res:Response):Promise<void>=>{
    try {
        const data=await UserPermission.findAll({
            include:[
                {model:AgentUser,attributes:['user_id','role_id','f_name','l_name']},
                {model:PageLevel,attributes:['id','permission_name','permission_url']}
            ]
            // include:[{model:AgentUser,attributes:{exclude:['password']}},{model:PageLevel}]
        })
        ResponseMessage(res,200,data)
    } catch (error) {
        ErrorMessage(res,error,400)
    }
}

// get single UserPermission
export const getSingleUserPermission=async(req:Request,res:Response):Promise<void>=>{
    const {id} =req.params
    try {
        const data=await UserPermission.findByPk(id,{
            include:[
                {model:AgentUser,attributes:['user_id','role_id','f_name','l_name']},
                {model:PageLevel,attributes:['id','permission_name','permission_url']}
            ]
        })
        if(!data) return ErrorMessage(res,"no data found with id : "+id,400)
        ResponseMessage(res,200,data)
    } catch (error) {
        ErrorMessage(res,error,400)
    }
}

// create UserPermission
export const createUserPermission=async(req:Request,res:Response):Promise<any>=>{
const { user_id, page_level_id }=req.body
    const body:UserPermissionProps = req.body;
    try {
    const validation = userPermission.safeParse(body);
    if(!validation.success) return ValidationError(validation,res);
    // this will check if we give permission so it will give but if the value come back again that will check and delete the data
    const find = await UserPermission.findOne({where: { user_id, page_level_id }});
    if (find) {
      find.destroy();
      return ResponseMessage(res, 200,undefined, "permission dinied");
    }
        const data = await UserPermission.create(req.body)
        ResponseMessage(res,200,data)
    } catch (error) {
        ErrorMessage(res,error,400)
    }
}

// update UserPermission
export const updateUserPermission=async(req:Request,res:Response):Promise<void>=>{
    const {id} =req.params
    try {
        const data=await UserPermission.findByPk(id)
        if(!data) return ErrorMessage(res,"no data found with id : "+id,400)
        const updateData=await UserPermission.update({...req.body},{where:{id}})
        ResponseMessage(res,200,undefined,"data updated successfully with id :"+id)
    } catch (error) {
        ErrorMessage(res,error,400)
    }
}

// find a user role permisions if exists then return the data else return null
export const findUserPermission=async(req:Request,res:Response):Promise<void>=>{
    try {
        const data=await UserPermission.findOne(
            {where:{user_id:req.body.user_id},
            include:{model:PageLevel,where:{permission_url:req.body.permission_url},
            attributes:["permission_name","permission_url"]}})
        // const data=await UserTypePermission.findOne({where:{user_type_id:req.body.user_type_id , page_level_id:req.body.page_level_id}})
        if(!data) return ErrorMessage(res,"no data found",200)
        ResponseMessage(res,200,data)
    } catch (error) {
        ErrorMessage(res,error,400)
    }
}