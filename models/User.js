const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Purchase = require('./Purchase'); // Importação direta do modelo Purchase

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});


module.exports = User;
