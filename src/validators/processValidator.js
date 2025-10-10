export default {
  validateCreate(data) {
    if (!data.userId) throw new Error("Campo userId é obrigatório.");
    if (!data.area) throw new Error("Campo area é obrigatório.");
    if (!data.processoSider) throw new Error("Campo processoSider é obrigatório.");
  },
};
