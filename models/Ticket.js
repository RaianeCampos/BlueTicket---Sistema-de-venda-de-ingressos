const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Purchase = require('./Purchase'); // Certifique-se de importar corretamente

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT, // Campo para a descrição/subtítulo
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('Inteiro', 'Social', 'Meia Entrada', 'VIP', 'Camarotes'), // Coluna para o tipo de ingresso
    allowNull: false,
    defaultValue: 'Inteiro', // Valor padrão
  },
}, {
  tableName: 'ticket',
  timestamps: true,
});


module.exports = Ticket;
