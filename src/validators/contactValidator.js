export default {
  validateCreate(data) {
    if (!data.name) throw new Error("O nome do contato é obrigatório");
  },

  validateUpdate(data) {
    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("O nome do contato não pode ser vazio");
    }
  },
};
