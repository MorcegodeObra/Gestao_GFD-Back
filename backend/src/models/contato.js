import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM("BAIXO", "MÉDIO", "ALTO", "URGENTE"),
    defaultValue: "BAIXO"
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: true
  },
  contatoStatus: {
    type: DataTypes.ENUM("REVISÃO DE PROJETO", "IMPLANTAÇÃO", "VISTORIA INICIAL", "VISTORIA FINAL", "ASSINATURAS", "SEM STATUS"),
    defaultValue: "SEM STATUS"
  },
  processoSider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.ENUM("AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"),
    defaultValue: "SEM AREA"
  },
  lastSent: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  answerMsg : {
    type: DataTypes.TEXT,
    allowNull: true
  },
  answerDate:{
    type: DataTypes.DATE,
    allowNull: true
  },
  lastInteration: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  answer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  check: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  executed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
});
