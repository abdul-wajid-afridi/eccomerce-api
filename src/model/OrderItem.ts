import { Model, DataTypes } from "sequelize";
import Connection from "../db/dbConfig";
import Products from "./ProductModel";
import Users from "./UserModel";
import Orders from "./OrderModel";

export interface OrderItemProps {
  id?: number;
  product_id: number;
  order_id: number;
  total_price: number;
  quantity: number;
}


class OrderItem extends Model<OrderItemProps> {}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    total_price: DataTypes.DECIMAL(),
    quantity: DataTypes.INTEGER,
  },
  {
    timestamps: true,
    sequelize: Connection,
    modelName: "order_items",
  }
);

Products.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Products, { foreignKey: "product_id" });

Orders.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Orders, { foreignKey: "order_id" });

export default OrderItem;
