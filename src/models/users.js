import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome do usuário não pode ser vazio" },
      len: {
        args: [2, 100],
        msg: "O nome do usuário deve ter entre 2 e 100 caracteres",
      },
      isValidName(value) {
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
        if (!nameRegex.test(value)) {
          throw new Error("Nome do usuário contém caracteres inválidos");
        }
      },
    },
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O email do usuário não pode ser vazio" },
      isEmail: { msg: "Email inválido" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "A senha não pode ser vazia" },
      len: { args: [6, 100], msg: "A senha deve ter no mínimo 6 caracteres" },
    },
  },
  userNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidPhone(value) {
        if (value) {
          const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
          if (!phoneRegex.test(value)) {
            throw new Error("Número de telefone inválido");
          }
        }
      },
    },
  },
  userArea: {
    type: DataTypes.ENUM(
      "AREA 1",
      "AREA 2",
      "AREA 3",
      "AREA 4",
      "AREA 5",
      "SEM AREA"
    ),
    defaultValue: "SEM AREA",
    validate: {
      isIn: {
        args: [["AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"]],
        msg: "Área inválida",
      },
    },
  },
  userCargo: {
    type: DataTypes.ENUM("ENGENHEIRO", "TÉCNICO", "COORDENADOR", "SEM CARGO"),
    defaultValue: "SEM CARGO",
    validate: {
      isIn: {
        args: [["ENGENHEIRO", "TÉCNICO", "COORDENADOR", "SEM CARGO"]],
        msg: "Cargo inválido",
      },
    },
  },
  userResumo: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: { isDate: { msg: "userResumo deve ser uma data válida" } },
  },
  numeroCrea: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Crea não cadastrado"
  },
  criados: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
  editados: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
  anuenciaCriados: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
  },
  anuenciaEditados: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 },
  },
});
