import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Contact = sequelize.define("Contact", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O nome do contato não pode ser vazio" },
      len: {
        args: [2, 100],
        msg: "O nome do contato deve ter entre 2 e 100 caracteres",
      },
      isValidName(value) {
        // Exemplo: permite letras, espaços, acentos e hífen
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
        if (!nameRegex.test(value)) {
          throw new Error("Nome do contato contém caracteres inválidos");
        }
      },
    },
  },
});

// Relacionamentos
import { ContactEmail } from "./contactEmail.js";
import { ContactNumber } from "./contactNumber.js";

Contact.hasMany(ContactEmail, { foreignKey: "contactId", onDelete: "CASCADE" });
ContactEmail.belongsTo(Contact, { foreignKey: "contactId" });

Contact.hasMany(ContactNumber, {
  foreignKey: "contactId",
  onDelete: "CASCADE",
});
ContactNumber.belongsTo(Contact, { foreignKey: "contactId" });
