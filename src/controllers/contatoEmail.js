// controllers/contactEmailController.js
import contactEmailService from "../services/contatoEmail.js";

export const adicionarEmail = async (req, res) => {
  try {
    const novosEmails = await contactEmailService.add(req.params.id, req.body.emails);
    res.status(201).json(novosEmails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editarEmail = async (req, res) => {
  try {
    const emailAtualizado = await contactEmailService.update(
      req.params.id,
      req.params.emailId,
      req.body
    );
    res.json(emailAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletarEmail = async (req, res) => {
  try {
    await contactEmailService.remove(req.params.emailId);
    res.json({ message: "Email deletado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
