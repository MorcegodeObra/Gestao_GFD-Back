import { User } from "../models/users.js";

export default {
  async create(data) {
    return await User.create(data);
  },

  async findAll() {
    return await User.findAll();
  },

  async findById(id) {
    return await User.findByPk(id);
  },

  async findByEmail(userEmail) {
    return await User.findOne({ where: { userEmail } });
  },

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  },

  async remove(id) {
    return await User.destroy({ where: { id } });
  },

  async incrementCreated(user) {
    await user.update({ criados: (user.criados || 0) + 1 });
  },

  async incrementEdited(user) {
    await user.update({ editados: (user.editados || 0) + 1 });
  },
};
