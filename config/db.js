const { Sequelize } = require('sequelize');


// Configuração do banco de dados PostgreSQL
const sequelize = new Sequelize('SistemaIngressos', 'postgres', 'R@i210613', {
  host: 'localhost', // Endereço do banco de dados
  dialect: 'postgres', // Tipo de banco de dados (postgres)
  port: 5433,
  logging: false, // Desativa logs de SQL no console (opcional)
});

// Testar a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', err);
  });

module.exports = sequelize;