import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const ContactNumber = sequelize.define('ContactPhone', {
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O número não pode ser vazio" },
      isValidPhone(value) {
        // Exemplo de regex para validar números no formato brasileiro
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        if (!phoneRegex.test(value)) {
          throw new Error("Número de telefone inválido");
        }
      }
    }
  },
  area: {
    type: DataTypes.ENUM("AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"),
    defaultValue: "SEM AREA",
    validate: {
      isIn: {
        args: [["AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"]],
        msg: "Área inválida"
      }
    }
  }
});
