export default {
  validateAdd(emails) {
    if (!Array.isArray(emails) || emails.length === 0)
      throw new Error("Nenhum email fornecido");

    emails.forEach(email => {
      if (!email.email) throw new Error("Campo 'email' é obrigatório");
    });
  },

  validateUpdate(data) {
    if (data.email !== undefined && data.email.trim() === "")
      throw new Error("Email não pode ser vazio");
  },
};
