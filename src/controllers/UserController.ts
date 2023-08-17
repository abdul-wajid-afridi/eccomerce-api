import Users, { UserAttributes } from "../model/UserModel";

import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import { Request, Response } from "express";

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
