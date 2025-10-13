import { Router } from "express";
import * as controller from "../controllers/userControllers.js";

const router = Router();

router.post("/", controller.createUser);
router.get("/", controller.listarUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.post("/login", controller.loginUser);

export default router;
