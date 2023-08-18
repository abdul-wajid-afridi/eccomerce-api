import { Response } from "express"

export const ResponseMessage=(res:Response,status:number,data?:any,message?:string)=>{
    res.status(status).json({
        status:"success",
        length:data?.length,
        message,
        data
    })
}