import { Contact } from '../models/contato.js';
import { ContactEmail } from '../models/contactEmail.js';

// Adicionar email ao contato
export const adicionarEmail = async (req, res) => {
  const { emails } = req.body;
  const { id } = req.params;

  try {
    const contato = await Contact.findByPk(id);
    if (!contato) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Nenhum email fornecido' });
    }

    const emailsToCreate = emails.map(emailData => ({
      ...emailData,
      contactId: contato.id
    }));

    const novosEmails = await ContactEmail.bulkCreate(emailsToCreate);

    res.status(201).json(novosEmails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar email.' });
  }
};

// Deletar email
export const deletarEmail = async (req, res) => {
  try {
    const email = await ContactEmail.findByPk(req.params.emailId);
    if (!email) return res.status(404).json({ error: 'Email não encontrado' });

    await email.destroy();
    res.json({ message: 'Email deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar email.' });
  }
};
