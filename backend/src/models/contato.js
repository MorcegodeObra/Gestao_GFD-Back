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
  lastSent: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastUserModified: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM("BAIXO", "MÉDIO", "ALTO", "URGENTE"),
    defaultValue: "BAIXO"
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
