const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const jwtSecret = process.env.JWT_SECRET; // Acessa a chave secreta

exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Lê o token do cookie

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''),  jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login'); // Se não for admin, redireciona para o login
};