import { Contact } from "../models/contato.js";
import { ContactEmail } from "../models/contactEmail.js";
import { ContactNumber } from "../models/contactNumber.js";

export default {
  async create(data) {
    return await Contact.create(data);
  },

  async findAll() {
    return await Contact.findAll({
      include: [ContactEmail, ContactNumber],
      order: [["name", "ASC"]],
    });
  },

  async findById(id) {
    return await Contact.findByPk(id, {
      include: [ContactEmail, ContactNumber],
    });
  },

  async update(id, data) {
    const contato = await Contact.findByPk(id);
    if (!contato) return null;
    return await contato.update({ name: data.name || contato.name });
  },

  async remove(id) {
    return await Contact.destroy({ where: { id } });
  },
};
