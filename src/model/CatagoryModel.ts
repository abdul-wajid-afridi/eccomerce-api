import { Model, DataTypes } from "sequelize";

import Connection from "../db/dbConfig";

export interface catagoryProps {
  id?: number;
  cat_name?: string;
}

class Catagories extends Model<catagoryProps> {}

Catagories.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cat_name: DataTypes.STRING,
  },
  {
    timestamps: true,
    sequelize: Connection,
    modelName: "catagories",
  }
);

export default Catagories;
