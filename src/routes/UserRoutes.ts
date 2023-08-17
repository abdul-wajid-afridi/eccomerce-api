import { IsAdminRole } from "./../middleware/UserRole";
import { Router } from "express";
import {
  signUp,
  getAllUsers,
  getCookies,
  loginUser,
  LogOut,
  deleteUser,
} from "../controllers/UserController";
import { UploadFiles } from "../utils/Uploads";
import protect from "../middleware/AuthMiddleware";

const routes = Router();

routes.get("/users", getAllUsers);
routes.post("/users/signup", UploadFiles.single("image"), signUp);
routes.post("/users/login", loginUser);
routes.post("/users/logout", LogOut);
routes.get("/users/cookie", getCookies);
// routes.patch("/users/:id",updateUser)
// first the protect will give user to IsAdminRole() function and will cheack if user is admin then it will go further for its functionality
// routes.delete("/users/:id", protect, deleteUser);
routes.delete("/users/:id", protect, IsAdminRole("ADMIN"), deleteUser);

export default routes;
