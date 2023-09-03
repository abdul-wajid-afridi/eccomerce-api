"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = require("./../middleware/UserRole");
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const Uploads_1 = require("../utils/Uploads");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const routes = (0, express_1.Router)();
routes.get("/users", UserController_1.getAllUsers);
routes.get("/users/cookie", UserController_1.getCookies);
routes.post("/users/signup", Uploads_1.UploadFiles.single("image"), UserController_1.signUp);
routes.post("/users/login", UserController_1.loginUser);
routes.post("/users/logout", UserController_1.LogOut);
// routes.patch("/users/:id",updateUser)
// first the protect will give user to IsAdminRole() function and will cheack if user is admin then it will go further for its functionality
// routes.delete("/users/:id", protect, deleteUser);
routes.delete("/users/:id", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("ADMIN"), UserController_1.deleteUser);
exports.default = routes;
