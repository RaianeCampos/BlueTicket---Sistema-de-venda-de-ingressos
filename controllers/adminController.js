const User = require('../models/User');
const Ticket = require('../models/Ticket');
const bcrypt = require('bcryptjs'); // 🔹 Certifique-se de importar isso no início do arquivo


exports.getAdminLogin = (req, res) => {
  res.render('adminLogin'); // Renderiza a view do login do administrador
};

exports.postAdminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca o usuário pelo nome e verifica se é admin
    const user = await User.findOne({ where: { username, isAdmin: true } });

    if (!user) {
      return res.render('adminLogin', { error: 'Usuário não encontrado ou não é administrador.' });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('adminLogin', { error: 'Senha incorreta.' });
    }

    // Armazena na sessão que o usuário é admin
    req.session.user = user;
    req.session.isAdmin = true;

    res.redirect('/admin'); // Redireciona para o painel do admin
  } catch (error) {
    console.error('Erro no login do admin:', error);
    res.status(500).send('Erro ao processar login.');
  }
};

// Exibe o painel do administrador
exports.getAdminPanel = async (req, res) => {
  try {
    const users = await User.findAll();
    const tickets = await Ticket.findAll();
    res.render('adminPanel', { users, tickets });
  } catch (error) {
    console.error('Erro ao carregar painel do administrador:', error);
    res.status(500).json({ error: 'Erro ao carregar painel do administrador.' });
  }
};

// Cria um novo usuário
exports.createUser = async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, isAdmin });
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
};

// Cria um novo ingresso
exports.createTicket = async (req, res) => {
  const { name, price, quantity, type, image, description } = req.body;

  try {
    const newTicket = await Ticket.create({ name, price, quantity, type, image, description });
    res.status(201).json({ message: 'Ingresso criado com sucesso!', ticket: newTicket });
  } catch (error) {
    console.error('Erro ao criar ingresso:', error);
    res.status(500).json({ error: 'Erro ao criar ingresso.' });
  }
};

// Edita um ingresso existente
exports.editTicket = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, type, image, description } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado.' });
    }

    ticket.name = name;
    ticket.price = price;
    ticket.quantity = quantity;
    ticket.type = type;
    ticket.image = image;
    ticket.description = description;

    await ticket.save();

    res.status(200).json({ message: 'Ingresso atualizado com sucesso!', ticket });
  } catch (error) {
    console.error('Erro ao editar ingresso:', error);
    res.status(500).json({ error: 'Erro ao editar ingresso.' });
  }
};

// Função para excluir um usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await user.destroy(); // Remove o usuário do banco de dados
    res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};

// Função para excluir um ingresso
exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado.' });
    }

    await ticket.destroy(); // Remove o ingresso do banco de dados
    res.status(200).json({ message: 'Ingresso excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir ingresso:', error);
    res.status(500).json({ error: 'Erro ao excluir ingresso.' });
  }
};