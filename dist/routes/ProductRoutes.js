"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController_1 = require("./../controllers/ProductController");
const express_1 = require("express");
const Uploads_1 = require("../utils/Uploads");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const routes = (0, express_1.Router)();
routes.get("/product", ProductController_1.getAllProducts);
routes.post("/product", AuthMiddleware_1.default, Uploads_1.UploadFiles.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), ProductController_1.createProduct);
routes.patch("/product/:id", AuthMiddleware_1.default, Uploads_1.UploadFiles.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), ProductController_1.updateProduct);
routes.get("/product/:id", ProductController_1.getSingleProduct);
routes.delete("/product/:id", AuthMiddleware_1.default, ProductController_1.deleteProduct);
routes.patch("/like-product", AuthMiddleware_1.default, ProductController_1.likeProduct);
exports.default = routes;
