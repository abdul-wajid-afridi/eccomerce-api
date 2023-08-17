import { IsAdminRole } from "./../middleware/UserRole";
import { Router } from "express";

import protect from "../middleware/AuthMiddleware";
import {
  createCatagory,
  deleteCatagory,
  getAllCatagories,
  updateCatagory,
} from "../controllers/CatagoryController";

const routes = Router();

routes.get("/catagory", getAllCatagories);
routes.post("/catagory", protect, IsAdminRole("ADMIN"), createCatagory);
routes.delete("/catagory/:id", protect, IsAdminRole("ADMIN"), deleteCatagory);
routes.patch("/catagory/:id", protect, IsAdminRole("ADMIN"), updateCatagory);

export default routes;
