import { Router } from "express";
import * as controller from "../controllers/contactController.js";
import * as controller from "../controllers/contactNumberController.js";
import * as controller from "../controllers/contactEmailController.js";

const router = Router();

// Emails
router.post("/:id/emails", controller.adicionarEmail);
router.put("/:id/emails/:emailId", controller.editarEmail);
router.delete("/:id/emails/:emailId", controller.deletarEmail);

// Telefones
router.post("/:id/numbers", controller.adicionarTelefone);
router.delete("/:id/numbers/:numberId", controller.deletarTelefone);

router.post("/", controller.criarContato);
router.get("/", controller.listarContatos);
router.get("/:id", controller.buscarContato);
router.put("/:id", controller.editarContato);
router.delete("/:id", controller.deletarContato);

export default router;
