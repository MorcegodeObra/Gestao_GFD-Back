import { Router } from "express";
import multer from "multer";
import { verificacaoPlanilhas } from "../functions/importarDados/verificação.js";
import { gerarEEnviarKmz } from "../functions/criarKMZ/criarKMZ.js";
import { enviarRelatorio } from "../functions/enviarPDF/servicoRelatorio.js";
import { resumoProcessosAtraso } from "../controllers/resumoAtraso/resumoProcessosAtraso.js";
import fileUpload from "express-fileupload";

const router = Router();
router.use(fileUpload());

const upload = multer({ dest: "src/uploads/" });

router.post(
  "/importarProcessos",
  upload.single("arquivo"),
  verificacaoPlanilhas
);
router.post("/gerarKMZ", gerarEEnviarKmz);
router.post("/relatorioPDF", enviarRelatorio);
router.post("/resumoAtraso", resumoProcessosAtraso);

export default router;
