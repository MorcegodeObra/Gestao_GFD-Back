import anuenciaRepository from "../repositories/anuenciaRepository.js";
import userRepository from "../repositories/userRepository.js";
import anuenciaValidator from "../validators/anuenciaValidator.js";

export default {
  async criar(data) {
    anuenciaValidator.validarCriacao(data);

    const user = await userRepository.findById(data.userId);
    if (!user) throw new Error("Usuário não encontrado");

    const nova = await anuenciaRepository.create(data);

    await userRepository.incrementarCriados(user.id);

    return nova;
  },

  async listar(query) {
    return await anuenciaRepository.findAll(query);
  },

  async buscarPorId(id) {
    return await anuenciaRepository.findById(id);
  },

  async editar(id, data) {
    const existente = await anuenciaRepository.findById(id);
    if (!existente) throw new Error("Protocolo não encontrado");

    // Regras de negócio
    let answerDate = data.respondido ? new Date() : existente.dataResposta;
    let novoStatus =
      !data.protocoloStatus && data.respondido
        ? "AGUARDANDO DER"
        : data.protocoloStatus || existente.protocoloStatus;

    if (data.respondido == false || existente.respondido == false) {
      existente.dataResposta = null;
      existente.mensagemResposta = null;
    }

    const atualizado = await anuenciaRepository.update(id, {
      ...data,
      dataResposta: answerDate,
      protocoloStatus: novoStatus,
    });

    // Atualiza contadores de usuário
    if (data.userId && data.userId !== 12) {
      await userRepository.incrementarEditados(data.userId);
    }

    return atualizado;
  },

  async deletar(id) {
    const existente = await anuenciaRepository.findById(id);
    if (!existente) throw new Error("Protocolo não encontrado");
    await anuenciaRepository.remove(id);
  },
};
