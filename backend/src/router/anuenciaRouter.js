import { Router } from "express";
import {
  novaAnuencia,
  listarAnuencias,
  editarAnuencia,
  deletarAnuencia,
  listarIdAnuencias,
} from "../controllers/anuenciaController.js";

const router = Router();

router.post("/", novaAnuencia);
router.get("/", listarAnuencias);
router.get("/:id", listarIdAnuencias);
router.patch("/:id", editarAnuencia);
router.delete("/:id", deletarAnuencia);

export default router;
