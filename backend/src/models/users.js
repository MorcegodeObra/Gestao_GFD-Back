import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userArea: {
    type: DataTypes.ENUM("AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"),
    defaultValue: "SEM AREA"
  },
  userCargo: {
    type: DataTypes.ENUM("ENGENHEIRO", "TÉCNICO", "COORDENADOR", "SEM CARGO"),
    defaultValue: "SEM CARGO"
  },
  userResumo: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  criados: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  editados: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  anuenciaCriados: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  anuenciaEditados: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});
