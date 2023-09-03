"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const UserModel_1 = __importDefault(require("./UserModel"));
class Orders extends sequelize_1.Model {
}
Orders.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: sequelize_1.DataTypes.BIGINT,
    total_price: sequelize_1.DataTypes.DECIMAL(),
    order_date: sequelize_1.DataTypes.DATE,
    status: sequelize_1.DataTypes.ENUM("DELIVERED", "PENDING"),
}, {
    timestamps: true,
    sequelize: dbConfig_1.default,
    modelName: "orders",
});
// Products.hasMany(Orders, { foreignKey: "product_id" });
// Orders.belongsTo(Products, { foreignKey: "product_id" });
UserModel_1.default.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(UserModel_1.default, { foreignKey: "user_id" });
exports.default = Orders;
