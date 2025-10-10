import { ContactEmail } from "../models/contactEmail.js";

export default {
  async bulkCreate(emails) {
    return await ContactEmail.bulkCreate(emails);
  },

  async findById(id) {
    return await ContactEmail.findByPk(id);
  },

  async findOne(emailId, contactId) {
    return await ContactEmail.findOne({
      where: { id: emailId, ContactId: contactId },
    });
  },

  async update(emailRegistro, data) {
    emailRegistro.email = data.email ?? emailRegistro.email;
    emailRegistro.area = data.area ?? emailRegistro.area;
    emailRegistro.rodovias = data.rodovias ?? emailRegistro.rodovias;
    await emailRegistro.save();
    return emailRegistro;
  },

  async remove(emailRegistro) {
    await emailRegistro.destroy();
  },
};
