"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
class Catagories extends sequelize_1.Model {
}
Catagories.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cat_name: sequelize_1.DataTypes.STRING,
}, {
    timestamps: true,
    sequelize: dbConfig_1.default,
    modelName: "catagories",
});
exports.default = Catagories;
