import { Router } from "express";
import multer from "multer";
import { verificacaoPlanilhas } from "../functions/importarDados/verificação.js";
import { gerarEEnviarKmz } from "../functions/criarKMZ/criarKMZ.js";
import { controladorRelatorio } from "../functions/anuenciaPDF/pdfController.js";
import { resumoProcessosAtraso } from "../controllers/resumoAtraso/resumoProcessosAtraso.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/importarProcessos",
  upload.single("arquivo"),
  verificacaoPlanilhas,
);
router.post("/gerarKMZ", upload.single("arquivo"), gerarEEnviarKmz);

router.post(
  "/relatorioPDF",
  upload.fields([
    { name: "fotosMaterial", maxCount: 10 },
    { name: "fotosObra", maxCount: 10 },
  ]),
  controladorRelatorio,
);

router.post("/resumoAtraso", resumoProcessosAtraso);

export default router;
