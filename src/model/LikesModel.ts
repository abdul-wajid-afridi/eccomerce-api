import { Model, DataTypes } from "sequelize";
import Connection from "../db/dbConfig";
import Products from "./ProductModel";
import Users from "./UserModel";

export interface LikeProps {
  id?: number;
  productId: number;
  userId: number;
}

class Likes extends Model<LikeProps> {}

Likes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      field: "user_id",
    },
    productId: {
      type: DataTypes.BIGINT,
      field: "product_id",
    },
  },
  {
    timestamps: true,
    sequelize: Connection,

    modelName: "likes",
  }
);

Products.hasMany(Likes);
Likes.belongsTo(Products);

Users.hasMany(Likes);
Likes.belongsTo(Users);

export default Likes;
