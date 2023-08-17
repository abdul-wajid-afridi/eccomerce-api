"use strict";
// // import { Model, DataTypes } from "sequelize";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // import Connection from "../db/dbConfig";
// // import Catagories from "./CatagoryModel";
// // import Users from "./UserModel";
// // export interface ProductProps {
// //   id: number;
// //   name: string;
// //   description: string;
// //   price: number;
// //   rating: number;
// //   cat: string;
// //   stock: number;
// //   numberOfReviews: number;
// //   reviews: string;
// // }
// // class Products extends Model<ProductProps> {}
// // // IdDetails.associate = (models, DataTypes) => {
// // //   IdDetails.hasMany(models.hearts, {
// // //     onDelete: "cascade",
// // //     foreignKey: "idDetails_id",
// // //   });
// // //   IdDetails.hasMany(models.like, {
// // //     onDelete: "cascade",
// // //     foreignKey: "idDetails_id",
// // //   });
// // //   IdDetails.hasMany(models.comments, {
// // //     onDelete: "cascade",
// // //     foreignKey: "idDetails_id",
// // //   });
// // // };
// // Products.init(
// //   {
// //     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
// //     name: DataTypes.STRING,
// //     description: DataTypes.STRING,
// //     price: DataTypes.NUMBER,
// //     rating: DataTypes.NUMBER,
// //     cat: DataTypes.STRING,
// //     stock: DataTypes.NUMBER,
// //     numberOfReviews: DataTypes.NUMBER,
// //     reviews: DataTypes.STRING,
// //   },
// //   {
// //     timestamps: true,
// //     sequelize: Connection,
// //     modelName: "products",
// //   }
// // );
// // // product + catagory association
// // // Products.hasMany(Catagories, {
// // //   sourceKey: "id",
// // //   foreignKey: "productId",
// // //   as: "catagories",
// // // });
// // // Catagories.belongsTo(Products, {
// // //   foreignKey: "productId",
// // //   as: "products",
// // // });
// // // Products.associate = (models: any) => {
// // //   Products.hasMany(models.Catagories, {
// // //     foreignKey: "prod_id",
// // //   });
// // // };
// // // Author.hasMany(Book, {
// // //     sourceKey: 'id',
// // //     foreignKey: 'authorId',
// // //     as: 'books'
// // //   });
// // // Book.belongsTo(Author, {
// // //     foreignKey: 'authorId',
// // //     as:
// // // )}
// // // users +product association
// // // Users.hasMany(Products, { sourceKey: "id" });
// // // Products.belongsTo(Users, { targetKey: "id" });
// // export default Products;
// import { Model, DataTypes } from "sequelize";
// import Connection from "../db/dbConfig";
// export interface ProductProps {
//   id?: number;
//   name: string;
//   description: string;
//   price: number;
//   rating: number;
//   cat: string;
//   stock: number;
//   num_reviews: number;
//   reviews: string;
// }
// class Products extends Model<ProductProps> {}
// Products.init(
//   {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//     name: DataTypes.STRING,
//     description: DataTypes.STRING,
//     price: DataTypes.INTEGER,
//     rating: DataTypes.INTEGER,
//     cat: DataTypes.STRING,
//     stock: DataTypes.INTEGER,
//     num_reviews: DataTypes.INTEGER,
//     reviews: DataTypes.STRING,
//   },
//   {
//     timestamps: true,
//     sequelize: Connection,
//     modelName: "products",
//   }
// );
// export default Products;
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../db/dbConfig"));
const CatagoryModel_1 = __importDefault(require("./CatagoryModel"));
const UserModel_1 = __importDefault(require("./UserModel"));
class Products extends sequelize_1.Model {
}
Products.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: sequelize_1.DataTypes.STRING,
    images: {
        type: sequelize_1.DataTypes.TEXT,
        // this is for uploading multiple images////
        get: function () {
            return JSON.parse(
            // create type for this
            this.getDataValue("images"));
        },
        set: function (val) {
            return this.setDataValue("images", JSON.stringify(val));
        },
        // try this also
        //   type: Sequelize.STRING,
        // get() {
        //   return this.getDataValue('paths').split(';');
        // },
        // set(val) {
        //   this.setDataValue('paths', val.join(';'));
        // },
    },
    description: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.INTEGER,
    rating: sequelize_1.DataTypes.INTEGER,
    stock: sequelize_1.DataTypes.INTEGER,
    num_reviews: sequelize_1.DataTypes.INTEGER,
    reviews: sequelize_1.DataTypes.STRING,
    // association fields
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        field: "user_id",
    },
    catagoryId: {
        type: sequelize_1.DataTypes.BIGINT,
        field: "catagory_id",
    },
}, {
    timestamps: true,
    sequelize: dbConfig_1.default,
    modelName: "products",
});
// Define the association between Users and Products
UserModel_1.default.hasMany(Products); // A user can have many products
Products.belongsTo(UserModel_1.default); // A product belongs to one user
// Define the association between catagory and Products
CatagoryModel_1.default.hasMany(Products); // A catagory can have many products
Products.belongsTo(CatagoryModel_1.default); // A product belongs to one catagory
// Products.addHook("beforeCreate", async (prod) => {
//   const result = await Products.findOne({
//     where: {
//       name: prod?.name,
//       price: prod?.price,
//     },
//   }).catch((e) => {});
//   if (result) throw { code: "Product already exist", data: result };
// });
exports.default = Products;
