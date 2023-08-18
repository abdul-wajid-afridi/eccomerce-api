import { Request, Response } from "express";
import PageLevel, { PageLevelProps } from "../model/PageLevelModel";
import { ErrorMessage } from "../utils/ErrorMessage";
import { ResponseMessage } from "../utils/ResponseMessage";
import { ValidationError } from "../utils/ValidationError";
import { z } from "zod";
 
// note the page-level is actually permission Page 
const PageLevelSchema=z.object({
  permission_url:z.string(),
  permission_name:z.string()
});
// create PageLevels
export const createPageLevel = async (req:Request,res:Response): Promise<any> => {
const {permission_url,permission_name}=req.body
// try {
//   const parent=await PageLevel.findOne({
//     order:[['parent_id',"DESC"]]
//   })
//  let id:number | undefined =  parent?.dataValues.parent_id
//   res.json({parent:id!+1})
//   // const data =await PageLevel.create()
// } catch (error) {
// console.log(error);
// }

  const body = PageLevelSchema.safeParse(req.body);
  try {
      if (!body.success) return ValidationError(body, res);

    const find = await PageLevel.findOne({where: { permission_url }});
    if (find)  return ResponseMessage(res, 200,undefined, "permission url already exists")

    const data: PageLevelProps = req.body;
    const level = await PageLevel.findAll()
    // let counter: number = 0;
    // if (data.parent_id) {
    //   counter = await PageLevel.count({ where: { parent_id: data.parent_id } }) + 1
    //   const parent = await PageLevel.findByPk(data.parent_id);
    //   data.level = `${parent?.getDataValue("level")}-${counter}`
    // } else {
    //   counter = (await PageLevel.count({ where: { parent_id: 0 } })) + 1
    //   data.level = `${counter}`;
    // }
    const newLevel = await PageLevel.create(data);
    if (newLevel) {
      return  ResponseMessage(res, 201, data);
    } else {
      return  ErrorMessage(res, "PageLevel not added!", 500);
    }
  } catch (error) {
    return  ErrorMessage(res, error, 400);
  }
};

// get single PageLevels
export const getSinglePageLevel = async (req: Request,res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const data = await PageLevel.findByPk(id);
    if (!data) return ErrorMessage(res, `no data found with id ${id}`, 400);
   return ResponseMessage(res, 200, data);
  } catch (error) {
    return ErrorMessage(res, error, 400);
  }
};

// get All PageLevels
export const getAllPageLevel = async (req: Request,res: Response): Promise<void> => {
  try {
    const data = await PageLevel.findAll();
  return  ResponseMessage(res, 200, data);
  } catch (error) {
  return  ErrorMessage(res, error, 400);
  }
};

// delete PageLevels
export const deletePageLevel = async (req: Request,res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const data = await PageLevel.findByPk(id);
      if (!data) return ErrorMessage(res, `no data found with id ${id}`, 400);
      const deleteData=await PageLevel.destroy({where:{id}})
      return  ResponseMessage(res, 200, undefined,"data deleted with id : "+id);
    } catch (error) {
      return  ErrorMessage(res, error, 400);
    }
};

// update PageLevels
export const updatePageLevel = async (req: Request,res: Response): Promise<any> => {
    const { id } = req.params;
    const body = PageLevelSchema.safeParse(req.body);
    try {
        if (!body.success) return ValidationError(body, res);
      const data = await PageLevel.findByPk(id);
      if (!data) return ErrorMessage(res, `no data found with id ${id}`, 400);
      const updateData=await PageLevel.update({...req.body},{where:{id:id}});
      return  ResponseMessage(res, 200, undefined,"data updated with id : "+id);
    } catch (error) {
      return  ErrorMessage(res, error, 400);
    }
};