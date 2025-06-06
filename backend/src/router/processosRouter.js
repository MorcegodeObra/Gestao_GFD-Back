import { Router } from 'express';
import {
  criarProcesso,
  listarProcesso,
  editarProcesso,
  deletarProcesso,
  listarIdProcesso,
} from '../controllers/processosController.js';

const router = Router();

router.post('/', criarProcesso);
router.get('/', listarProcesso);
router.get('/:id', listarIdProcesso);
router.put('/:id', editarProcesso);
router.delete('/:id', deletarProcesso);

export default router;
