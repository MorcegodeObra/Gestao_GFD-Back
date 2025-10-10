export default {
  validateAdd(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0)
      throw new Error("Nenhum telefone fornecido");

    numbers.forEach(num => {
      if (!num.number) throw new Error("Campo 'number' é obrigatório");
    });
  },
};
