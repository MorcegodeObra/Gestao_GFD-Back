import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const ContactNumber = sequelize.define('ContactPhone', {
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.ENUM("AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5", "SEM AREA"),
    defaultValue: "SEM AREA"
  }
});


