import contactRepository from "../repositories/contato.js";
import contactNumberRepository from "../repositories/contatoNumber.js";

export default {
  async add(contactId, numbers) {
    const contato = await contactRepository.findById(contactId);
    if (!contato) throw new Error("Contato não encontrado");

    const numbersToCreate = numbers.map((number) => ({
      ...number,
      contactId: contato.id,
    }));

    return await contactNumberRepository.bulkCreate(numbersToCreate);
  },

  async remove(numberId) {
    const number = await contactNumberRepository.findById(numberId);
    if (!number) throw new Error("Telefone não encontrado");
    await contactNumberRepository.remove(number);
  },
};
