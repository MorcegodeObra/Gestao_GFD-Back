import contactRepository from "../repositories/contato.js";

export default {
  async create(data) {
    return await contactRepository.create(data);
  },

  async update(id, data) {
    const existing = await contactRepository.findById(id);
    if (!existing) throw new Error("Contato não encontrado");
    return await contactRepository.update(id, data);
  },

  async listAll() {
    return await contactRepository.findAll();
  },

  async findById(id) {
    return await contactRepository.findById(id);
  },

  async remove(id) {
    const contato = await contactRepository.findById(id);
    if (!contato) throw new Error("Contato não encontrado");
    await contactRepository.remove(id);
  },
};
