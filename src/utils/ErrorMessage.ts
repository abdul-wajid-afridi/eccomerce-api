import { Response } from "express"

export const ErrorMessage=(res:Response,error:any,status:number)=>{
    res.status(status).json({
        status:"fail",
        message:error
    })
}