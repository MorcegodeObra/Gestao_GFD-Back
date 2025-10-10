import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const ContactEmail = sequelize.define('ContactEmail', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O email não pode ser vazio" },
      isEmail: { msg: "O email deve ser válido" }
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
  },
  rodovias: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    validate: {
      isArrayValid(value) {
        if (value && !Array.isArray(value)) {
          throw new Error("Rodovias deve ser um array");
        }
      }
    }
  }
});
