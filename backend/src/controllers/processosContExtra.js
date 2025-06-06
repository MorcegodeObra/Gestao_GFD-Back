import { Contact } from '../models/contato.js';

export const adicionarValorContato = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    if (!['email', 'number'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido. Use "email" ou "number".' });
    }

    if (!value || typeof value !== 'string') {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    const contact = await Contact.findByPk(id);
    if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

    const currentList = contact[type] || [];

    if (currentList.includes(value)) {
      // Se já existe, apenas retorna o contato sem erro
      return res.json({ message: `${type} já existe`, contato: contact });
    }

    const updatedList = [...currentList, value];
    await contact.update({ [type]: updatedList });

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar valor ao contato' });
  }
};


export const removerValorContato = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    if (!['email', 'number'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido. Use "email" ou "number".' });
    }

    if (!value || typeof value !== 'string') {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    const contact = await Contact.findByPk(id);
    if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

    const currentList = contact[type] || [];
    const updatedList = currentList.filter(item => item !== value);

    if (updatedList.length === currentList.length) {
      return res.status(404).json({ error: `${type} não encontrado no contato` });
    }

    await contact.update({ [type]: updatedList });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover valor do contato' });
  }
};
