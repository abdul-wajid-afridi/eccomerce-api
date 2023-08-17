"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = require("./../middleware/UserRole");
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const CatagoryController_1 = require("../controllers/CatagoryController");
const routes = (0, express_1.Router)();
routes.get("/catagory", CatagoryController_1.getAllCatagories);
routes.post("/catagory", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("ADMIN"), CatagoryController_1.createCatagory);
routes.delete("/catagory/:id", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("ADMIN"), CatagoryController_1.deleteCatagory);
routes.patch("/catagory/:id", AuthMiddleware_1.default, (0, UserRole_1.IsAdminRole)("ADMIN"), CatagoryController_1.updateCatagory);
exports.default = routes;
