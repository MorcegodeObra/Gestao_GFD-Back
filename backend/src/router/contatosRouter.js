import { Router } from 'express';
import {
  criarContato,
  listarContato,
  listarId,
  editarContato,
  deletarContato,
} from '../controllers/contatoController.js';

const router = Router();

router.post('/', criarContato);
router.get('/', listarContato);
router.get('/:id', listarId);
router.put('/:id', editarContato);
router.delete('/:id', deletarContato);

export default router;
