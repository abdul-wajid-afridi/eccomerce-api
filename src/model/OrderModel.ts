import { Model, DataTypes } from "sequelize";
import Connection from "../db/dbConfig";
import Products from "./ProductModel";
import Users from "./UserModel";

export interface OrderProps {
  id?: number;
  // user id means its buyer_id who buys this order or products
  user_id: number;
  total_price: number;
  order_date: Date;
  status: "DELIVERED" | "PENDING";
}

class Orders extends Model<OrderProps> {}

Orders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.BIGINT,
    total_price: DataTypes.DECIMAL(),
    order_date: DataTypes.DATE,
    status: DataTypes.ENUM("DELIVERED", "PENDING"),
  },
  {
    timestamps: true,
    sequelize: Connection,
    modelName: "orders",
  }
);

// Products.hasMany(Orders, { foreignKey: "product_id" });
// Orders.belongsTo(Products, { foreignKey: "product_id" });

Users.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(Users, { foreignKey: "user_id" });

export default Orders;
