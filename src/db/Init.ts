import Catagories from "../model/CatagoryModel";
import GemTypeModel from "../model/GemTypeModel";
import Likes from "../model/LikesModel";
import Products from "../model/ProductModel";
import Users from "../model/UserModel";
const isDev = process.env.NODE_ENV === "development";

const dbInit = () => {
  // Users.sync({ alter: isDev });
  Users.sync({ force: true });
  Catagories.sync({ force: true });
  Products.sync({ force: true });
  Likes.sync({ force: true });
  GemTypeModel.sync({ force: true });
};
export default dbInit;
