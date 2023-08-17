"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const ProductModel_1 = __importDefault(require("./ProductModel"));
const UserModel_1 = __importDefault(require("./UserModel"));
class Orders extends sequelize_1.Model {
}
Orders.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        field: "user_id",
    },
    productId: {
        type: sequelize_1.DataTypes.BIGINT,
        field: "product_id",
    },
}, {
    timestamps: true,
    sequelize: dbConfig_1.default,
    modelName: "orders",
});
ProductModel_1.default.hasMany(Orders);
Orders.belongsTo(ProductModel_1.default);
UserModel_1.default.hasMany(Orders);
Orders.belongsTo(UserModel_1.default);
exports.default = Orders;
