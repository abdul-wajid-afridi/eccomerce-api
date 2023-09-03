import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getUserProducts,
  likeProduct,
  updateProduct,
} from "./../controllers/ProductController";
import { Router } from "express";
import { UploadFiles } from "../utils/Uploads";
import protect from "../middleware/AuthMiddleware";
import { IsAdminRole } from "../middleware/UserRole";

const routes = Router();

routes.get("/product", getAllProducts);
routes.post(
  "/product",
  protect,
  UploadFiles.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createProduct
);
routes.patch(
  "/product/:id",
  protect,
  UploadFiles.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateProduct
);
routes.get("/product/:id", getSingleProduct);
routes.delete("/product/:id", protect, deleteProduct);

routes.patch("/like-product", protect, likeProduct);

export default routes;
