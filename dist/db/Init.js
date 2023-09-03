"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CatagoryModel_1 = __importDefault(require("../model/CatagoryModel"));
const GemTypeModel_1 = __importDefault(require("../model/GemTypeModel"));
const LikesModel_1 = __importDefault(require("../model/LikesModel"));
const OrderItem_1 = __importDefault(require("../model/OrderItem"));
const OrderModel_1 = __importDefault(require("../model/OrderModel"));
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
const isDev = process.env.NODE_ENV === "development";
const dbInit = () => {
    // Users.sync({ alter: isDev });
    UserModel_1.default.sync({ force: false });
    OrderModel_1.default.sync({ force: false });
    OrderItem_1.default.sync({ force: false });
    CatagoryModel_1.default.sync({ force: false });
    ProductModel_1.default.sync({ force: false });
    LikesModel_1.default.sync({ force: false });
    GemTypeModel_1.default.sync({ force: false });
};
exports.default = dbInit;
