import Express from "express";
import {
  createOrder,
  getAllOrders,
  getAllAdminOrders,
  getSingleOrder,
  getUsersOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController";
import protect from "../middleware/AuthMiddleware";
import { IsAdminRole } from "../middleware/UserRole";

const Routes = Express.Router();

Routes.post("/orders", protect, createOrder);
Routes.get("/orders", protect, getAllOrders);
Routes.get("/single-order/:id", protect, getSingleOrder);
Routes.get("/users-orders", protect, getUsersOrders);
Routes.get("/admin-orders", protect, IsAdminRole("admin"), getAllAdminOrders);
Routes.patch(
  "/update-orderstatus/:id",
  protect,
  IsAdminRole("admin"),
  updateOrderStatus
);
Routes.delete("/order/:id", protect, IsAdminRole("admin"), deleteOrder);

export default Routes;
