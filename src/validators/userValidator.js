export default {
  validateCreate(data) {
    if (!data.userName) throw new Error("Nome do usuário é obrigatório");
    if (!data.userEmail) throw new Error("Email é obrigatório");
    if (!data.password) throw new Error("Senha é obrigatória");
  },
};
