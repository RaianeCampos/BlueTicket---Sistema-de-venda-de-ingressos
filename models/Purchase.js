const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Ticket = require('./Ticket');
const User = require('./User'); // Importa o modelo User

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Nome da tabela correta
      key: 'id',
    },
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ticket', // Nome correto da tabela
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('Dinheiro', 'Pix', 'Cartão', 'Boleto'),
    allowNull: false,
    defaultValue: 'Dinheiro'
  },
  status: {
    type: DataTypes.ENUM('pendente', 'concluída', 'cancelada'),
    defaultValue: 'pendente',
    allowNull: false,
  },
}, {
  tableName: 'purchases',
  timestamps: true,
});


module.exports = Purchase;
