import { Anuencia } from "../models/protocoloAnuencia.js";
import { Op } from "sequelize";

export default {
  async create(data) {
    return await Anuencia.create(data);
  },

  async findAll({ userId, notUserId }) {
    const where = {};
    if (userId) where.userId = userId;
    if (notUserId) where.userId = { [Op.ne]: notUserId };

    return await Anuencia.findAll({
      where,
      order: [["updatedAt", "DESC"]],
    });
  },

  async findById(id) {
    return await Anuencia.findByPk(id);
  },

  async update(id, data) {
    const registro = await Anuencia.findByPk(id);
    if (!registro) return null;
    return await registro.update(data);
  },

  async remove(id) {
    return await Anuencia.destroy({ where: { id } });
  },
};
