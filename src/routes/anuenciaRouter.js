import { Router } from "express";
import * as controller from "../controllers/anuencia.js";

const router = Router();

router.post("/", controller.novaAnuencia);
router.get("/", controller.listarAnuencias);
router.get("/:id", controller.listarIdAnuencias);
router.patch("/:id", controller.editarAnuencia);
router.delete("/:id", controller.deletarAnuencia);

export default router;
