import contactService from "../services/contactService.js";

export const criarContato = async (req, res) => {
  try {
    const contato = await contactService.create(req.body);
    res.status(201).json(contato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarContato = async (req, res) => {
  try {
    const contato = await contactService.update(req.params.id, req.body);
    res.status(200).json(contato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarContatos = async (req, res) => {
  try {
    const contatos = await contactService.listAll();
    res.json(contatos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarContato = async (req, res) => {
  try {
    const contato = await contactService.findById(req.params.id);
    if (!contato) return res.status(404).json({ error: "Contato não encontrado" });
    res.json(contato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletarContato = async (req, res) => {
  try {
    await contactService.remove(req.params.id);
    res.json({ message: "Contato deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
