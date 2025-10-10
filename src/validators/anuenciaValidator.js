export default {
  validarCriacao(data) {
    if (!data.protocolo) throw new Error("Campo 'protocolo' é obrigatório");
    if (!data.area) throw new Error("Campo 'area' é obrigatório");
    if (!data.userId) throw new Error("Usuário é obrigatório");
  },
};
