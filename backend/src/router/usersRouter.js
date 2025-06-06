import { Router } from 'express';
import {
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/userControllers.js';

const router = Router();

router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

export default router;
