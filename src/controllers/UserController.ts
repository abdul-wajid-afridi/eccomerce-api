import Users, { UserAttributes } from "../model/UserModel";

import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import { ErrorMessage } from "../utils/ErrorMessage";
import { ResponseMessage } from "../utils/ResponseMessage";
// import nodeCahe from ""

interface UserProp {
  email: string;
  password: string;
  id: string;
}

// get all users only by admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await Users.findAll();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "failed",
      error: error,
    });
  }
};

// create users
export const signUp = async (req: Request, res: Response) => {
  const { password, name, email, role } = req.body;
  const image = req.file?.filename;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const data = await Users.create({
      name,
      email,
      role,
      image,
      password: hashPassword,
    });
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error,
    });
  }
};

// login users
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: UserProp = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "please enter email or password " });
  }
  try {
    // const user: {password:string,email:string,id:number} = await Users.findOne({
    const user: any = await Users.findOne({
      where: { email },
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

    const token = jwt.sign(
      { name: user.email, id: user.id },
      process.env.SECRETE_KEY as string
    );
    const options = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("token", token, options)
      .json({ result: user, token });
  } catch (error) {
    res.json({
      status: "failed",
      message: "some thing went wrong",
    });
  }
};

// logOut users
export const LogOut = (req: Request, res: Response) => {
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
  req: Request | any,
  res: Response
): Promise<Response | void> => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return;
    }
    return res.json({
      user: req.user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// only main admin can delete this account
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await Users.destroy({ where: { id: id } });
    res.status(200).json({
      status: "success",
      // data: user,
      message: `user deleted successfully with id ${id}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// // forget password.
// export const forgetPassword = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const findEmail = await Users.findOne({
//       where: { email: req.body.email },
//     });
//     if (!findEmail)
//       return ErrorMessage(res, "no data found with given Email", 404);
//     const value = Math.random().toString();
//     const code = value.slice(value.length - 7, value.length - 1);
// // this will store a code in cache for 120 seconds and then we will compare it with the sended code in email inside verficationCode() function
// // cache.set("code",code)
// cache.set("code",parseInt(code),60) //storing for 1 mnts
// cache.set("user",(findEmail),240) //storing for 4 mnts

//     sendMail(
//       [req.body.email],
//       "Password verifcation Code",
//       `<p>your verication code is ${parseInt(code)}</p>`
//     );

//     ResponseMessage( res, 200, undefined, `verification code send to ${req.body.email}`
//     );
//   } catch (error) {
//     ErrorMessage(res, error, 400);
//   }
// }

// // a verifcation code will be send to the email and verified
// export const verificationCode = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const verifyCode=cache.get("code") as string

//     // let user:AgentUserProp | undefined =cache.get("user")
//     let user:any = cache.get("user")

//  const token = jwt.sign(
//   { email: user?.email, id: user?.id},
//   process.env.SECRETE_KEY as string
// );

// const options = {
//   expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//   httpOnly: true,
// };

//     if(parseInt(verifyCode)===parseInt(req.body.code)){
//        res
//       .status(200)
//       .cookie("token", token, options)
//       .json({ message: `Verification Successfully ${req.body.code}`, token ,id: user?.user_id });
//     }else{
//       ErrorMessage( res,  `Verification Failed with ${req.body.code}`,400)
//     }

//   } catch (error) {
//     ErrorMessage(res, `token might be expired please send token again`, 400)
//   }
// };
