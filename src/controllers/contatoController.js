import { Contact } from '../models/contato.js';
import { ContactEmail } from "../models/contactEmail.js"
import { ContactNumber } from "../models/contactNumber.js"

// Criar contato
export const criarContato = async (req, res) => {
  try {
    const { name } = req.body;
    const contato = await Contact.create({ name });
    res.status(201).json(contato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar contato.' });
  }
};

export const editarContato = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const contato = await Contact.findByPk(id);
    if (!contato) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    contato.name = name;
    await contato.save();

    res.status(200).json(contato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar o contato.' });
  }
};


// Listar contatos
export const listarContatos = async (req, res) => {
  try {
    const contatos = await Contact.findAll({
      include: [ContactEmail, ContactNumber]
    });
    res.json(contatos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar contatos.' });
  }
};

// Buscar por ID
export const buscarContato = async (req, res) => {
  try {
    const contato = await Contact.findByPk(req.params.id, {
      include: [ContactEmail, ContactNumber]
    });
    if (!contato) return res.status(404).json({ error: 'Contato não encontrado.' });
    res.json(contato);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contato.' });
  }
};

// Deletar contato
export const deletarContato = async (req, res) => {
  try {
    const contato = await Contact.findByPk(req.params.id);
    if (!contato) return res.status(404).json({ error: 'Contato não encontrado.' });
    await contato.destroy();
    res.json({ message: 'Contato deletado.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar contato.' });
  }
};
