// repositories/ContactRepository.js
import { Contact } from '../../../../models/contato.js';
import { ContactEmail } from '../../../../models/contactEmail.js';
import { ContactNumber } from '../../../../models/contactNumber.js';

export class ContactRepository {
  async buscarPorId(id) {
    return Contact.findByPk(id, {
      include: [
        { model: ContactEmail },
        { model: ContactNumber },
      ]
    });
  }
}
