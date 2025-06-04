import { Router } from 'express';
import {
  criarContato,
  listarContato,
  listarId,
  editarContato,
  deletarContato,
} from '../controllers/contatoController.js';
import {
  createUser,
  listarUser,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userControllers.js";

import {
  criarProcesso,
  listarProcesso,
  editarProcesso,
  deletarProcesso,
  listarIdProcesso,
} from "../controllers/processosController.js"
const router = Router();

router.post('/contatos', criarContato);
router.get('/contatos', listarContato);
router.get('/contatos/:id', listarId);
router.put('/contatos/:id', editarContato);
router.delete('/contatos/:id', deletarContato);

router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

router.post('/processos', criarProcesso);
router.get('/processos', listarProcesso);
router.get('/processos/:id', listarIdProcesso);
router.put('/processos/:id', editarProcesso);
router.delete('/processos/:id', deletarProcesso);

export default router;
