"use strict";
// import { Sequelize } from "sequelize-typescript";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Connection = new Sequelize({
//   dialect: "mysql",
//   host: "localhost",
//   username: "root",
//   password: "",
//   database: "vecteezy",
//   logging: false,
// });
// export default Connection;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Connection = new sequelize_typescript_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    // always check the port number of xamp
    port: 3336,
    // Also, the host property in the options object is marked with a non-null assertion operator (!) to indicate that we're sure that process.env.HOST won't be undefined at runtime.
    host: process.env.HOST,
    // host: "localhost",
    dialect: "mysql",
    logging: false,
});
exports.default = Connection;
