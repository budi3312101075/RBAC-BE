import { Router } from "express";
import { addUsers, getUsers } from "../../controllers/users";
import { privateRoutes } from "../../middleware/privateRoutes";

const router = Router();

router.get("/users", privateRoutes, getUsers);
router.post("/users", privateRoutes, addUsers);

export default router;
