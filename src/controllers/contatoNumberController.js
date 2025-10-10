import contactNumberService from "../services/contactNumberService.js";

export const adicionarTelefone = async (req, res) => {
  try {
    const novosNumbers = await contactNumberService.add(req.params.id, req.body.numbers);
    res.status(201).json(novosNumbers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletarTelefone = async (req, res) => {
  try {
    await contactNumberService.remove(req.params.numberId);
    res.json({ message: "Telefone deletado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
