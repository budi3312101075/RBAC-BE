import { Router } from "express";
import users from "./api/users";
import auth from "./api/auth";
import roles from "./api/roles";
import permissions from "./api/permissions";

const router = Router();

const api = "/api/v1";
router.use(api, users);
router.use(api, auth);
router.use(api, roles);
router.use(api, permissions);

export default router;
