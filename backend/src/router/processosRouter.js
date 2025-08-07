import { Router } from 'express';
import {
  criarProcesso,
  listarProcesso,
  editarProcesso,
  deletarProcesso,
  listarIdProcesso,
  resumoSemanal,
  aceitarSolicitacao,
} from '../controllers/processosController.js';
import { resumoProcessosAtraso } from '../controllers/resumoAtraso/resumoProcessosAtraso.js';

import { adicionarValorContato, removerValorContato } from "../controllers/processosContExtra.js"

const router = Router();

router.post('/', criarProcesso);
router.get('/', listarProcesso);
router.get('/:id', listarIdProcesso);
router.put('/:id', editarProcesso);
router.delete('/:id', deletarProcesso);
router.get("/resumoSemanal/:userId",resumoSemanal)

router.post("/:id/addValor", adicionarValorContato)
router.post("/:id/removerValor", removerValorContato)
router.post("/id", aceitarSolicitacao)
router.post("/:id/aceitarProcesso", aceitarSolicitacao)
router.post("/resumoAtraso", resumoProcessosAtraso)

export default router;
