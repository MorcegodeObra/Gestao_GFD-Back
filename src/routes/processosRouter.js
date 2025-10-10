import { Router } from "express";
import * as controller from "../controllers/processController.js";

const router = Router();

router.post("/", controller.criarProcesso);
router.get("/", controller.listarProcesso);
router.get("/:id", controller.listarIdProcesso);
router.put("/:id", controller.editarProcesso);
router.delete("/:id", controller.deletarProcesso);
router.get("/resumo/:userId", controller.resumoSemanal);
router.post("/:id/aceitar", controller.aceitarSolicitacao);

export default router;
