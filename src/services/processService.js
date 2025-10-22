import processRepository from "../repositories/processRepository.js";
import userRepository from "../repositories/userRepository.js";
import { Op } from "sequelize";

export default {
  async create(data) {
    const user = await userRepository.findById(data.userId);
    if (!user) throw new Error("Usuário não encontrado.");

    const process = await processRepository.create({
      ...data,
      lastInteration: data.lastSent,
    });

    await userRepository.incrementCreated(user);

    return process;
  },

  async list({ userId, notUserId }) {
    const where = {};
    if (userId) where.userId = userId;
    if (notUserId) where.userId = { [Op.ne]: notUserId };

    return await processRepository.listAll(where);
  },

  async findById(id) {
    const process = await processRepository.findById(id);
    if (!process) {
      const err = new Error("Processo não encontrado");
      err.status = 404;
      throw err;
    }
    return process;
  },

  async update(id, data) {
    const process = await processRepository.findById(id);
    if (!process) {
      const err = new Error("Processo não encontrado");
      err.status = 404;
      throw err;
    }

    const donoAtual = process.userId;
    const novoDono = Number(data.userId);

    // Solicitação de transferência
    if (novoDono !== 12 && donoAtual !== novoDono && donoAtual !== 12) {
      await processRepository.markTransfer(process, novoDono);
      const err = new Error("Solicitação de transferência enviada.");
      err.status = 202;
      throw err;
    }

    // Reset de cobrança e datas
    let answerDate = data.answer ? new Date() : process.answerDate;
    let novoStatus =
      !data.contatoStatus && data.answer
        ? "AGUARDANDO DER"
        : data.contatoStatus || process.contatoStatus;

    if (data.answer === false) {
      process.answerDate = null;
      process.answerMsg = null;
    }

    if (data.answer === true) {
      process.cobrancas = 0;
    }

    const updated = await processRepository.update(process, {
      ...data,
      answerDate,
      contatoStatus: novoStatus,
      lastInteration: data.lastSent,
      solicitacaoProcesso: false,
      newUserId: null,
    });

    if (novoDono !== 12) {
      const user = await userRepository.findById(novoDono);
      if (user) await userRepository.incrementarEditados(user);
    }

    return updated;
  },

  async remove(id) {
    const process = await processRepository.findById(id);
    if (!process) {
      const err = new Error("Processo não encontrado");
      err.status = 404;
      throw err;
    }
    await processRepository.remove(process);
  },

  async weeklySummary(userId) {
    const hoje = new Date();
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(hoje.getDate() - 7);

    const criados = await processRepository.listAll({
      userId,
      createdAt: { [Op.gte]: umaSemanaAtras },
    });

    const modificados = await processRepository.listAll({
      userId,
      lastInteration: { [Op.gte]: umaSemanaAtras },
    });

    return {
      semana: {
        de: umaSemanaAtras.toISOString().split("T")[0],
        ate: hoje.toISOString().split("T")[0],
      },
      criados: {
        total: criados.length,
        lista: criados.map((p) => p.processoSider),
      },
      modificados: {
        total: modificados.length,
        lista: modificados.map((p) => p.processoSider),
      },
    };
  },

  async acceptTransfer(id, userId) {
    const process = await processRepository.findById(id);
    if (!process) {
      const err = new Error("Processo não encontrado");
      err.status = 404;
      throw err;
    }

    if (!process.solicitacaoProcesso || !process.newUserId) {
      const err = new Error("Não há solicitação pendente.");
      err.status = 400;
      throw err;
    }

    if (process.userId !== userId) {
      const err = new Error("Sem permissão para aprovar esta solicitação.");
      err.status = 403;
      throw err;
    }

    return await processRepository.acceptTransfer(process);
  },
};
