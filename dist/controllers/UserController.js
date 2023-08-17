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
