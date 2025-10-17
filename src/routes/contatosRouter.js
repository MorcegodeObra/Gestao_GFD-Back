import { Router } from "express";
import * as contato from "../controllers/contatoController.js";
import * as numeroContato from "../controllers/contatoNumberController.js";
import * as emailContato from "../controllers/contatoEmailController.js";

const router = Router();

// Emails
router.post("/:id/emails", emailContato.adicionarEmail);
router.patch("/:id/emails/:emailId", emailContato.editarEmail);
router.delete("/:id/emails/:emailId", emailContato.deletarEmail);

// Telefones
router.post("/:id/numbers", numeroContato.adicionarTelefone);
router.delete("/:id/numbers/:numberId", numeroContato.deletarTelefone);

router.post("/", contato.criarContato);
router.get("/", contato.listarContatos);
router.get("/:id", contato.buscarContato);
router.patch("/:id", contato.editarContato);
router.delete("/:id", contato.deletarContato);

export default router;
