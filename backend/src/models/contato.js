import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Aqui ficam só os relacionamentos:
import { ContactEmail } from './contactEmail.js';
import { ContactNumber } from './contactNumber.js';

Contact.hasMany(ContactEmail, { foreignKey: 'contactId', onDelete: 'CASCADE' });
ContactEmail.belongsTo(Contact, { foreignKey: 'contactId' });

Contact.hasMany(ContactNumber, { foreignKey: 'contactId', onDelete: 'CASCADE' });
ContactNumber.belongsTo(Contact, { foreignKey: 'contactId' });
