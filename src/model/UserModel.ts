import { Model, DataTypes } from "sequelize";
import Connection from "../db/dbConfig";

export interface UserAttributes {
  id?: number;
  name?: string;
  email: string;
  password: string;
  image?: string;
  role?: "ADMIN" | "SELLER" | "USER";
}

class Users extends Model<UserAttributes> {}

Users.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("ADMIN", "SELLER", "USER"),
      defaultValue: "USER",
    },
  },
  {
    timestamps: true,
    sequelize: Connection,
    modelName: "users",
    // validate: {
    //   check() {
    //     if (!this.name) throw "Name is required!";
    //     if (!this.email) throw "Email is required!";
    //     if (!this.password) throw "Password is required!";
    //   },
    // },
  }
);
export default Users;
