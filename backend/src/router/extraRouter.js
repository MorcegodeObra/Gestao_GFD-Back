import { Router } from 'express';
import multer from 'multer';
import { verificacaoPlanilhas } from '../functions/importarDados/verificação.js';

const router = Router();
const upload = multer({ dest: 'uploads/src/' });

router.post('/importarProcessos', upload.single('arquivo'), verificacaoPlanilhas);

export default router;
