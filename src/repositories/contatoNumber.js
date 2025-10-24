import { ContactNumber } from "../models/contactNumber.js";

export default {
  async bulkCreate(numbers) {
    return await ContactNumber.bulkCreate(numbers);
  },

  async findById(id) {
    return await ContactNumber.findByPk(id);
  },

  async remove(numberRegistro) {
    await numberRegistro.destroy();
  },
};
