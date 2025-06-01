import { Contact } from '../models/contato.js';
import { Op } from 'sequelize';

export const criarContato = async (req, res) => {
  try {
    const {
      name,
      number,
      email,
      subject,
      priority,
      userId,
      contatoStatus,
      processoSider,
      protocolo,
      area,
      lastSent,
    } = req.body;

    const contact = await Contact.create({
      name,
      number,
      email,
      subject,
      priority,
      userId,
      contatoStatus,
      processoSider,
      protocolo,
      area,
      lastSent,
      lastInteration: lastSent,
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o contato. Tente novamente mais tarde.' });
  }
};

export const listarContato = async (req, res) => {
  const { userId, notUserId } = req.query;
  let whereClause = {};

  if (userId) {
    whereClause.userId = userId;
  }
  if (notUserId) {
    whereClause.userId = { [Op.ne]: notUserId }; // Sequelize operador "not equal"
  }
  try {
    const contatos = await Contact.findAll({
      where: whereClause,
      order: [['updatedAt', 'DESC']],
    });
    res.json(contatos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarId = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contato não encontrado' });
    }
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ error: 'Erro ao buscar o contato. Tente novamente mais tarde.' });
  }
};

export const editarContato = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

    const {
      name,
      number,
      email,
      subject,
      priority,
      userId,
      lastSent,
      contatoStatus,
      processoSider,
      protocolo,
      area,
      answer,
    } = req.body;

    await contact.update({
      name,
      number,
      email,
      subject,
      priority,
      userId,
      lastSent,
      lastInteration: lastSent,
      contatoStatus,
      processoSider,
      protocolo,
      area,
      answer,
    });

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar o contato. Tente novamente mais tarde.' });
  }
};

export const deletarContato = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    await contact.destroy();
    res.json({ message: 'Contato deletado com sucesso' });
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ error: 'Erro ao deletar o contato. Tente novamente mais tarde.' });
  }
};

export const atualizarCamposContato = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

    const {
      subject,
      priority,
      answer,
      check,
      executed,
      lastSent,
      contatoStatus,
      processoSider,
      protocolo,
      area,
    } = req.body;

    await contact.update({
      subject: subject ?? contact.subject,
      priority: priority ?? contact.priority,
      answer: answer ?? contact.answer,
      check: check ?? contact.check,
      executed: executed ?? contact.executed,
      lastSent: lastSent ?? contact.lastSent,
      contatoStatus: contatoStatus ?? contact.contatoStatus,
      processoSider: processoSider ?? contact.processoSider,
      protocolo: protocolo ?? contact.protocolo,
      area: area ?? contact.area,
    });

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o contato. Tente novamente mais tarde.' });
  }
};
