"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CatagoryModel_1 = __importDefault(require("../model/CatagoryModel"));
const LikesModel_1 = __importDefault(require("../model/LikesModel"));
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
const isDev = process.env.NODE_ENV === "development";
const dbInit = () => {
    // Users.sync({ alter: isDev });
    UserModel_1.default.sync({ force: true });
    CatagoryModel_1.default.sync({ force: true });
    ProductModel_1.default.sync({ force: true });
    LikesModel_1.default.sync({ force: true });
};
exports.default = dbInit;
