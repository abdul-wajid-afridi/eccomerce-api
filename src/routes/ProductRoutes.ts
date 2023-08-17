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
routes.post("/product", protect, UploadFiles.array("image"), createProduct);
routes.patch(
  "/product/:id",
  protect,
  UploadFiles.array("image"),
  updateProduct
);
routes.get("/product/:id", getSingleProduct);
routes.delete("/product/:id", protect, deleteProduct);
// routes.get("/user-products/:id", protect, getUserProducts);

// admin routes
routes.delete("/product/:id", protect, IsAdminRole("ADMIN"), deleteProduct);
routes.get(
  "/user-products/:id",
  protect,
  IsAdminRole("ADMIN"),
  getUserProducts
);
routes.post(
  "/product",
  protect,
  IsAdminRole("ADMIN"),
  UploadFiles.array("image"),
  createProduct
);
routes.patch(
  "/product/:id",
  protect,
  IsAdminRole("ADMIN"),
  UploadFiles.array("image"),
  updateProduct
);

// likes route .... it is put request because we are updating it
routes.put("/like-product", protect, likeProduct);

export default routes;
