import { Router } from "express";
import multer from "multer";
import { verificacaoPlanilhas } from "../functions/importarDados/verificação.js";
import { gerarEEnviarKmz } from "../functions/criarKMZ/criarKMZ.js";
import { enviarRelatorio } from "../functions/enviarPDF/servicoRelatorio.js";
import { resumoProcessosAtraso } from "../controllers/resumoAtraso/resumoProcessosAtraso.js";

const router = Router();
const upload = multer({ dest: "src/uploads/" });

router.post(
  "/importarProcessos",
  upload.single("arquivo"),
  verificacaoPlanilhas
);
router.post("/gerarKMZ", upload.single("arquivo"), gerarEEnviarKmz);
router.post("/relatorioPDF", enviarRelatorio);
router.post("/resumoAtraso", resumoProcessosAtraso);

export default router;
