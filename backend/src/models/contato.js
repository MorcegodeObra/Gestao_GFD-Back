import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  email: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
});
