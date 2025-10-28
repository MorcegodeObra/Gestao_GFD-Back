import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const SREDer = sequelize.define("SREDer", {
  codigoSRE: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      notEmpty: { msg: "Código SRE não pode ser vazio" },
    },
  },
  area: {
    type: DataTypes.ENUM(
      "AREA 1",
      "AREA 2",
      "AREA 3",
      "AREA 4",
      "AREA 5",
      "SEM AREA"
    ),
    allowNull: false,
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
