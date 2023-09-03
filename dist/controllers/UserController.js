"use strict";
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
exports.deleteUser = exports.getCookies = exports.LogOut = exports.loginUser = exports.signUp = exports.getAllUsers = void 0;
const UserModel_1 = __importDefault(require("../model/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// get all users only by admin
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield UserModel_1.default.findAll();
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            error: error,
        });
    }
});
exports.getAllUsers = getAllUsers;
// create users
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password, name, email, role } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    try {
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        const data = yield UserModel_1.default.create({
            name,
            email,
            role,
            image,
            password: hashPassword,
        });
        res.status(200).json({
            data,
        });
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: error,
        });
    }
});
exports.signUp = signUp;
// login users
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: "fail", message: "please enter email or password " });
    }
    try {
        // const user: {password:string,email:string,id:number} = await Users.findOne({
        const user = yield UserModel_1.default.findOne({
            where: { email },
        });
        // UserAttributes
        if (!user)
            return res
                .status(400)
                .json({ status: "fail", message: "wrong credentials" });
        const comparePassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!comparePassword)
            return res
                .status(400)
                .json({ status: "fail", message: "wrong credentials" });
        const token = jsonwebtoken_1.default.sign({ name: user.email, id: user.id }, process.env.SECRETE_KEY);
        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res
            .status(200)
            .cookie("token", token, options)
            .json({ result: user, token });
    }
    catch (error) {
        res.json({
            status: "failed",
            message: "some thing went wrong",
        });
    }
});
exports.loginUser = loginUser;
// logOut users
const LogOut = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.json({
        status: "success",
        message: "user logout success",
    });
};
exports.LogOut = LogOut;
const getCookies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    try {
        if (!token) {
            return;
        }
        return res.json({
            user: req.user,
            token,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.getCookies = getCookies;
// only main admin can delete this account
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield UserModel_1.default.destroy({ where: { id: id } });
        res.status(200).json({
            status: "success",
            // data: user,
            message: `user deleted successfully with id ${id}`,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.deleteUser = deleteUser;
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
