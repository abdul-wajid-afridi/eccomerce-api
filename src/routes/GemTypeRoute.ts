import { IsAdminRole } from "./../middleware/UserRole";
import { Router } from "express";

import protect from "../middleware/AuthMiddleware";
import {
  createGemType,
  deleteGemType,
  getAllGemTypes,
  updateGemType,
} from "../controllers/GemTypeController";

const routes = Router();

routes.get("/gem-type", getAllGemTypes);
routes.post("/gem-type", protect, IsAdminRole("ADMIN"), createGemType);
routes.delete("/gem-type/:id", protect, IsAdminRole("ADMIN"), deleteGemType);
routes.patch("/gem-type/:id", protect, IsAdminRole("ADMIN"), updateGemType);

export default routes;
