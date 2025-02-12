const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');

exports.showLoginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.showRegisterPage = (req, res) => {
  res.render('register', { error: null }); // Página de registro (opcional)
};

exports.showPurchaseHistory = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{ model: Ticket, as: 'Ticket' }],
    });
    res.render('purchaseHistory', { purchases });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico de compras.' });
  }
};

exports.showTicketDetails = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado.' });
    }
    res.render('ticketDetails', { ticket });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do ingresso.' });
  }
};