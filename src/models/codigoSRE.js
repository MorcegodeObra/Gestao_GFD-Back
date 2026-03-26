import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const SREDer = sequelize.define("SREDer", {
  codigoSRE: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    validate: {
      notEmpty: { msg: "Código SRE não pode ser vazio" },
    },
  },
  rodovia: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Rodovia não pode ser vazia" } },
  },
  decreto: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Sem decreto encontrado",
  },
  ano: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Sem ano encontrado",
  },
  de: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Sem local de inicio cadastrado",
  },
  para: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Sem local de final cadastrado",
  },
  larguraFaixa: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});
