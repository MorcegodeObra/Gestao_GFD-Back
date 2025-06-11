import { Contact } from '../models/contato.js';
import { ContactNumber } from '../models/contactNumber.js';

// Adicionar múltiplos telefones ao contato
export const adicionarTelefone = async (req, res) => {
  const { numbers } = req.body;  // <- agora espera um array de objetos
  const { id } = req.params;

  try {
    const contato = await Contact.findByPk(id);
    if (!contato) return res.status(404).json({ error: 'Contato não encontrado' });

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: 'Nenhum telefone fornecido' });
    }

    const numbersToCreate = numbers.map(numberData => ({
      ...numberData,
      contactId: contato.id
    }));

    const novosnumbers = await ContactNumber.bulkCreate(numbersToCreate);

    res.status(201).json(novosnumbers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar telefone.' });
  }
};

// Deletar telefone
export const deletarTelefone = async (req, res) => {
  try {
    const number = await ContactNumber.findByPk(req.params.numberId);
    if (!number) return res.status(404).json({ error: 'Telefone não encontrado' });

    await number.destroy();
    res.json({ message: 'Telefone deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar telefone.' });
  }
};
