// // import { Model, DataTypes } from "sequelize";

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

import { Model, DataTypes } from "sequelize";
import Connection from "../db/dbConfig";
import Catagories from "./CatagoryModel";
import Users from "./UserModel";
import GemTypeModel from "./GemTypeModel";
type GallProp = { url: string };

export interface ProductProps {
  id?: number;
  name: string;
  images: GallProp[];
  thumbnail: string;
  video: string;
  description: string;
  price: number;
  stock: number;
  catagory_id: number;
  gem_type_id: number;
  user_id: number;
  created_at: Date;
}

class Products extends Model<ProductProps> {}
Products.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    images: {
      type: DataTypes.TEXT,
      // this is for uploading multiple images////
      get: function () {
        return JSON.parse(
          // create type for this
          this.getDataValue("images") as any
        );
      },
      set: function (val) {
        return this.setDataValue("images", JSON.stringify(val) as any);
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
    thumbnail: DataTypes.STRING,
    video: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    // association fields
    user_id: DataTypes.BIGINT,
    catagory_id: DataTypes.BIGINT,
    gem_type_id: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
  },
  {
    timestamps: false,
    sequelize: Connection,
    modelName: "products",
  }
);

// Define the association between Users and Products
Users.hasMany(Products, { foreignKey: "user_id" }); // A user can have many products
Products.belongsTo(Users, { foreignKey: "user_id" }); // A product belongs to one user

// Define the association between catagory and Products
Catagories.hasMany(Products, { foreignKey: "catagory_id" }); // A catagory can have many products
Products.belongsTo(Catagories, { foreignKey: "catagory_id" }); // A product belongs to one catagory

GemTypeModel.hasMany(Products, { foreignKey: "gem_type_id" });
Products.belongsTo(GemTypeModel, { foreignKey: "gem_type_id" });

// Products.addHook("beforeCreate", async (prod) => {
//   const result = await Products.findOne({
//     where: {
//       name: prod?.name,
//       price: prod?.price,
//     },
//   }).catch((e) => {});
//   if (result) throw { code: "Product already exist", data: result };
// });

export default Products;
