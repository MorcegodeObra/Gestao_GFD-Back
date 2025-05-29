import { Contact } from '../../models/contato.js';

export async function getPendingContacts() {
  return await Contact.findAll({
    where: {
      answer: false,
    },
  });
}
