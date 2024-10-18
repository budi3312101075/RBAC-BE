import { Router } from "express";
import {
  getModuleByRole,
  updateRoleModule,
} from "../../controllers/permissions";
import { privateRoutes } from "../../middleware/privateRoutes";

const router = Router();

router.get("/permissions/:roleId", getModuleByRole);
router.patch("/permissions/:roleId", privateRoutes, updateRoleModule);

export default router;
