import { Contact } from '../models/contato.js';

export const criarContato = async (req, res) => {
  try {
    const { name, number, email, subject, priority,lastUserModified } = req.body;
    const contact = await Contact.create({ name, number, email, subject, priority,lastUserModified });
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o contato. Tente novamente mais tarde.' });
  }
};

export const listarContato = async (req, res) => {
  const { userId } = req.query; // Recebe via query params

  try {
    const whereClause = userId ? { lastUserModified: userId } : {};

    const contatos = await Contact.findAll({
      where: whereClause,
      order: [['updatedAt', 'DESC']], // Opcional: ordena por última atualização
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
    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    const { name, number, email, subject, priority, lastUserModified,lastSent } = req.body;
    await contact.update({ name, number, email, subject, priority, lastUserModified,lastSent });
    res.json(contact);
  } catch (error) {
    console.error(error); // Log do erro
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

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    // Extraindo os campos a serem atualizados
    const { subject, priority, answer, check, executed, lastSent } = req.body;

    // Atualizando apenas os campos fornecidos
    await contact.update({
      subject: subject || contact.subject,
      lastSent: lastSent || contact.lastSent,
      priority: priority || contact.priority,
      answer: answer !== undefined ? answer : contact.answer,  // Para garantir que o valor booleano não seja alterado para `undefined`
      check: check !== undefined ? check : contact.check,        // O mesmo para o campo `check`
      executed: executed !== undefined ? executed : contact.executed,  // O mesmo para `executed`
    });

    res.json(contact);  // Retorna o contato atualizado
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ error: 'Erro ao atualizar o contato. Tente novamente mais tarde.' });
  }
}