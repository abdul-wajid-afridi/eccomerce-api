import Catagories from "../model/CatagoryModel";
import GemTypeModel from "../model/GemTypeModel";
import Likes from "../model/LikesModel";
import OrderItem from "../model/OrderItem";
import Orders from "../model/OrderModel";
import Products from "../model/ProductModel";
import Users from "../model/UserModel";
const isDev = process.env.NODE_ENV === "development";

const dbInit = () => {
  // Users.sync({ alter: isDev });
  Users.sync({ force: false });
  Orders.sync({ force: false });
  OrderItem.sync({ force: false });
  Catagories.sync({ force: false });
  Products.sync({ force: false });
  Likes.sync({ force: false });
  GemTypeModel.sync({ force: false });
};
export default dbInit;
