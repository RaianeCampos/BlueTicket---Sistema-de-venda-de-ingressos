const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  // Validações básicas
  if (!username || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Verifica se o username já existe
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    // Compara a senha fornecida com a senha armazenada (criptografada)
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      return res.status(400).json({ error: 'Nome de usuário e senha já estão em uso.' });
    } else {
      return res.status(400).json({ error: 'Nome de usuário já está em uso.' });
    }
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
  } catch (error) {
    console.log("error ", error)
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

     // Armazena o token em um cookie
     res.cookie('token', token, {
      httpOnly: true, // O cookie só pode ser acessado pelo servidor
      secure: process.env.NODE_ENV === 'production', // Usa HTTPS em produção
      maxAge: 3600000, // Tempo de vida do cookie (1 hora)
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log("error ", error)
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};


exports.logout = (req, res) => {
  // Limpa o cookie 'token'
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout realizado com sucesso!' });
};

require('dotenv').config();

exports.masterLogin = async (req, res) => {
  const { password } = req.body;

  try {
    if (password === process.env.MASTER_PASSWORD) {
      // Senha master correta
      res.status(200).json({ message: 'Acesso concedido à área do administrador.' });
    } else {
      // Senha master incorreta
      res.status(401).json({ error: 'Senha master incorreta.' });
    }
  } catch (error) {
    console.error('Erro ao verificar senha master:', error);
    res.status(500).json({ error: 'Erro ao verificar senha master.' });
  }
};