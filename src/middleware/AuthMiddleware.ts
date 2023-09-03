// import jwt from "jsonwebtoken";
// import Users from "../Models/UsersModel.js";
// const { verify } = jwt;
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const validToken = verify(token, process.env.SECRETE_KEY);
//       // this line mean to find a user by this token and remove password from it coz we will store it as a token
//       req.user = await Users.findById(validToken.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401).json({
//         message: "no token authorised error",
//       });
//     }
//   }
//   if (!token) {
//     res.status(401).json({
//       message: "no token authorised error",
//     });
//   }
// };
// export default protect;
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Users from "../model/UserModel";
const { verify } = jwt;

const protect = async (req: any, res: Response, next: NextFunction) => {
  let { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "no token authorised error",
    });
  }

  try {
    const validToken: any = verify(token, process.env.SECRETE_KEY as string);
    // this line mean to find a user by this token and remove password from it coz we will store it as a token
    // req.user = await Users.findById(validToken.id).select("-password");
    req.user = await Users.findByPk(validToken.id, {
      attributes: { exclude: ["password"] },
    });

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "no token authorised error",
    });
  }
};

export default protect;
