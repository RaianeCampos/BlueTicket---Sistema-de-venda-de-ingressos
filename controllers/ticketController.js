const Ticket = require('../models/Ticket');

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.render('tickets', { tickets }); // Renderiza a view com os dados dos ingressos
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingressos.' + error});
  }
};

// Método para API (JSON) usado no fetch()
exports.getAllTicketsJSON = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets); // Retorna JSON para o JavaScript
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingressos.' + error });
  }
};

exports.createTicket = async (req, res) => {
  const { name, price, quantity } = req.body;

  try {
    const ticket = await Ticket.create({ name, price, quantity });
    res.render('tickets', { tickets })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ticket.' });
  }
};

exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado.' });
    }

    ticket.name = name;
    ticket.price = price;
    ticket.quantity = quantity;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o ticket.' });
  }
};

exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado.' });
    }

    await ticket.destroy();
    res.status(204).json({ message: 'Ticket deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o ticket.' });
  }
};

exports.getTicketDetails = async (req, res) => {
  const ticketId = req.params.id; // Obtém o ID do ticket da URL

  try {
    // Busca o ticket no banco de dados
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      return res.status(404).render('error', { message: 'Ticket não encontrado.' });
    }

    // Renderiza a página de detalhes do ticket
    res.render('ticketDetails', { ticket });
  } catch (error) {
    console.error('Erro ao buscar detalhes do ticket:', error);
    res.status(500).render('error', { message: 'Erro ao buscar detalhes do ticket.' });
  }
};
