const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mustacheExpress = require('mustache-express');
const sequelize = require('./config/db');
const User = require('./models/User');
const Ticket = require('./models/Ticket')
const Purchase = require('./models/Purchase')
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const jwtSecret = process.env.JWT_SECRET; // Acessa a chave secreta
console.log('Chave secreta:', jwtSecret);

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const webRoutes = require('./routes/webRoutes'); 
const adminRoutes = require('./routes/adminRoutes');


app.use(session({
  secret: process.env.MASTER_PASSWORD, // Defina uma chave segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como "true" se estiver usando HTTPS
}));

// Configuração do Mustache
app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/user', userRoutes);


// Configuração do Express...
app.use(express.static('public'));
app.set('view engine', 'mustache');
app.set('views', './views');

app.use('/purchases', purchaseRoutes);

app.use('/admin', adminRoutes); 

// Rotas da Interface Web
app.use('/', webRoutes); 

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: req.app.get('env') === 'development' ? err : {} });
});

process.on('uncaughtException', (err) => {
  console.error('🚨 Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Rejeição de Promise não tratada:', reason);
});

// User.hasMany(Purchase);
// Purchase.belongsTo(User);
// Ticket.hasMany(Purchase, { foreignKey: 'ticketId', as: 'purchases' });
// Purchase.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Definição das relações
User.hasMany(Purchase, { foreignKey: 'userId', as: 'userPurchases' });
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Ticket.hasMany(Purchase, { foreignKey: 'ticketId', as: 'ticketPurchases' });
Purchase.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

sequelize.sync({ force: false }) // force: true recria as tabelas (cuidado em produção)
  .then(async () => {
    console.log('Tabelas sincronizadas com o banco de dados.');

    // Verifica se o usuário MASTER já existe
    const masterUser = await User.findOne({ where: { username: 'MASTER' } });
    if (!masterUser) {
      // Cria o usuário MASTER
      const hashedPassword = await bcrypt.hash(process.env.MASTER_PASSWORD, 10);
      await User.create({
        username: 'MASTER',
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('Usuário MASTER criado com sucesso.');
    }
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });


module.exports = app;