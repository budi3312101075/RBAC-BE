import { Router } from "express";
import { privateRoutes } from "../../middleware/privateRoutes";
import {
  getRoles,
  addRoles,
  updateRoles,
  deleteRoles,
} from "../../controllers/roles";

const router = Router();

router.get("/roles", privateRoutes, getRoles);
router.post("/roles", privateRoutes, addRoles);
router.patch("/roles/:id", privateRoutes, updateRoles);
router.delete("/roles/:id", privateRoutes, deleteRoles);

export default router;
