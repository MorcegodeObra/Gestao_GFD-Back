import { Router } from "express";
import * as controller from "../controllers/codigoSRE.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const router = Router();

router.post("/", controller.criarCodigo);
router.post("/planilha", upload.single("arquivo"), controller.importarPlanilha);
router.get("/", controller.listarCodigos);
router.get("/:id", controller.buscarCodigo);
router.patch("/:id", controller.editarCodigo);
router.delete("/:id", controller.deletarCodigo);

export default router;
