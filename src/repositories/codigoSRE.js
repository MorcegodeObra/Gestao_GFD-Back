import { SREDer } from "../models/codigoSRE.js";

export default {
  async create(data) {
    return await SREDer.create(data);
  },

  async findAll() {
    return await SREDer.findAll({
      order: [["codigoSRE", "ASC"]],
    });
  },

  async findById(id) {
    return await SREDer.findByPk(id);
  },

  async update(id, data) {
    const codigoSRE = await SREDer.findByPk(id);
    if (!codigoSRE) return null;
    return await codigoSRE.update(data);
  },

  async remove(id) {
    return await SREDer.destroy({ where: { id } });
  },
};
