import { Router } from 'express';
import {
  criarContato,
  listarContato,
  listarId,
  editarContato,
  deletarContato,
  atualizarCamposContato,
} from '../controllers/contatoController.js';
import {
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userControllers.js";

const router = Router();

router.post('/contatos', criarContato);
router.get('/contatos', listarContato);
router.get('/contatos/:id', listarId);
router.put('/contatos/:id', editarContato);
router.delete('/contatos/:id', deletarContato);
router.put('/contatos/:id/atualizar', atualizarCamposContato);

router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

export default router;
