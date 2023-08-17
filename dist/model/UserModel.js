"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class Users extends sequelize_1.Model {
}
Users.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    image: sequelize_1.DataTypes.STRING,
    role: {
        type: sequelize_1.DataTypes.ENUM("ADMIN", "SELLER", "USER"),
        defaultValue: "USER",
    },
}, {
    timestamps: true,
    sequelize: dbConfig_1.default,
    modelName: "users",
    // validate: {
    //   check() {
    //     if (!this.name) throw "Name is required!";
    //     if (!this.email) throw "Email is required!";
    //     if (!this.password) throw "Password is required!";
    //   },
    // },
});
exports.default = Users;
