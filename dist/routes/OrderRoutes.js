"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderController_1 = require("../controllers/OrderController");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const UserRole_1 = require("../middleware/UserRole");
const Routes = express_1.default.Router();
Routes.post("/orders", AuthMiddleware_1.default, OrderController_1.createOrder);
Routes.get("/orders", AuthMiddleware_1.default, OrderController_1.getAllOrders);
Routes.get("/single-order/:id", AuthMiddleware_1.default, OrderController_1.getSingleOrder);
Routes.get("/users-orders", AuthMiddleware_1.default, OrderController_1.getUsersOrders);
Routes.get("/admin-orders", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("admin"), OrderController_1.getAllAdminOrders);
Routes.patch("/update-orderstatus/:id", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("admin"), OrderController_1.updateOrderStatus);
Routes.delete("/order/:id", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("admin"), OrderController_1.deleteOrder);
exports.default = Routes;
