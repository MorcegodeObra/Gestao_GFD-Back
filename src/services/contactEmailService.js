import contactRepository from "../repositories/contactRepository.js";
import contactEmailRepository from "../repositories/contactEmailRepository.js";

export default {
  async add(contactId, emails) {
    const contato = await contactRepository.findById(contactId);
    if (!contato) throw new Error("Contato não encontrado");

    const emailsToCreate = emails.map((email) => ({
      ...email,
      contactId: contato.id,
    }));

    return await contactEmailRepository.bulkCreate(emailsToCreate);
  },

  async update(contactId, emailId, data) {
    const email = await contactEmailRepository.findOne(emailId, contactId);
    if (!email) throw new Error("Email não encontrado");

    return await contactEmailRepository.update(email, data);
  },

  async remove(emailId) {
    const email = await contactEmailRepository.findById(emailId);
    if (!email) throw new Error("Email não encontrado");

    await contactEmailRepository.remove(email);
  },
};
