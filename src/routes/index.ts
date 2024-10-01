import { Router } from "express";
import users from "./api/users";
import auth from "./api/auth";

const router = Router();

const api = "/api/v1";
router.use(api, users); // Menambahkan /users ke /api/v1
router.use(api, auth); // Menambahkan /auth ke /api/v1

export default router;
