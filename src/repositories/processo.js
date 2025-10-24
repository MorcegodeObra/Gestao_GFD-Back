import { Process } from "../models/processo.js";

export default {
  async create(data) {
    return await Process.create(data);
  },

  async listAll(where) {
    return await Process.findAll({
      where,
      order: [["updatedAt", "DESC"]],
    });
  },

  async findById(id) {
    return await Process.findByPk(id);
  },

  async update(process, data) {
    await process.update(data);
    return process;
  },

  async remove(process) {
    await process.destroy();
  },

  async markTransfer(process, newUserId) {
    await process.update({
      solicitacaoProcesso: true,
      newUserId,
    });
  },

  async acceptTransfer(process) {
    await process.update({
      userId: process.newUserId,
      solicitacaoProcesso: false,
      newUserId: null,
    });
    return process;
  },
};
