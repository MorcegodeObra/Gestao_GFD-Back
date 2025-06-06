import { Router } from 'express';
import {
  criarProcesso,
  listarProcesso,
  editarProcesso,
  deletarProcesso,
  listarIdProcesso,
} from '../controllers/processosController.js';

import { adicionarValorContato, removerValorContato } from "../controllers/processosContExtra.js"

const router = Router();

router.post('/', criarProcesso);
router.get('/', listarProcesso);
router.get('/:id', listarIdProcesso);
router.put('/:id', editarProcesso);
router.delete('/:id', deletarProcesso);

router.post("/:id/addValor", adicionarValorContato)
router.post("/:id/removerValor", removerValorContato)

export default router;
