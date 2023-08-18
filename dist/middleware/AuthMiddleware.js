"use strict";
// import jwt from "jsonwebtoken";
// import Users from "../Models/UsersModel.js";
// const { verify } = jwt;
// const protect = async (req, res, next) => {
//   let token;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
const { verify } = jsonwebtoken_1.default;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: "no token authorised error",
        });
    }
    try {
        const validToken = verify(token, process.env.SECRETE_KEY);
        // this line mean to find a user by this token and remove password from it coz we will store it as a token
        // req.user = await Users.findById(validToken.id).select("-password");
        req.user = yield UserModel_1.default.findByPk(validToken.id, { attributes: { exclude: ["password"] } });
        return next();
    }
    catch (error) {
        return res.status(401).json({
            message: "no token authorised error",
        });
    }
});
exports.default = protect;
