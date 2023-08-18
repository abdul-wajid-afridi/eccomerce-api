import { Response } from "express";
import { SafeParseError, SafeParseSuccess, ZodError, z } from "zod";

type IssueProps = {
  path: string;
  message: string;
};

// type BodyProp={
//     success:boolean,
//     error:{
//         issues:IssueProps
//     }
// }

export const ValidationError = (body:any, res: Response) => {
    return res.status(403).json({
      status: "fail",
      message: body?.error.issues?.map((it: IssueProps) => {
        return `${it.path} : ${it.message}`;
      }),
    });
};
