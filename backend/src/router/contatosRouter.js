import express from 'express';
import * as ContactController from '../controllers/contatoController.js'
import * as ContactEmailController from '../controllers/contatoEmailController.js';
import * as ContactNumberController from '../controllers/contatoNumberController.js';

const router = express.Router();

// Contato principal
router.post('/', ContactController.criarContato);
router.get('/', ContactController.listarContatos);
router.get('/:id', ContactController.buscarContato);
router.delete('/:id', ContactController.deletarContato);
router.patch('/:id',ContactController.editarContato);

// Emails
router.post('/:id/emails', ContactEmailController.adicionarEmail);
router.patch('/:id/emails/:emailId', ContactEmailController.editarEmail);
router.delete('/:id/emails/:emailId', ContactEmailController.deletarEmail);

// Telefones
router.post('/:id/number', ContactNumberController.adicionarTelefone);
router.delete('/:id/number/:numberId', ContactNumberController.deletarTelefone);

export default router;
