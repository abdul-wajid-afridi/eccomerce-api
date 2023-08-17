import { Model, DataTypes } from "sequelize";

import Connection from "../db/dbConfig";

export interface GemTypeProps {
  id?: number;
  gem_type?: string;
}

class GemTypeModel extends Model<GemTypeProps> {}

GemTypeModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    gem_type: DataTypes.STRING,
  },
  {
    timestamps: true,
    sequelize: Connection,
    modelName: "gem_type",
  }
);

export default GemTypeModel;
