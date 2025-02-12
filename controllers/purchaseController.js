const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

exports.getUserPurchases = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado

  try {
    // Busca todas as compras do usuário
    const purchases = await Purchase.findAll({
      where: { userId },
      include: [
        { model: Ticket, as: 'ticket' }, // Inclui os dados do ingresso
        { model: User, as: 'user', attributes: ['username'] } // Inclui os dados do usuário
      ],
    });

    // Retorna as compras em formato JSON
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Erro ao buscar compras do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar compras do usuário.' });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  const userId = req.user.id; // Obtém o ID do usuário autenticado
  console.log(userId);
  try {
    // Busca todas as compras do usuário
    const purchases = await Purchase.findAll({
      where: { userId },
      // include: [{ model: Ticket, as: 'ticket' }]
      include: [
        { model: Ticket, as: 'ticket' }, // Inclui os dados do ingresso
        { model: User, as: 'user', attributes: ['username'] } // Inclui os dados do usuário
      ]
    });
    // Renderiza a página de histórico de compras
    res.render('purchaseHistory', { purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o histórico de compras.' });
  }
};

exports.processPurchase = async (req, res) => {
  const { ticketId, quantity, clientCode, clientName, clientPhone, clientEmail } = req.body;
  const userId = req.user.id; // Obtém o ID do usuário autenticado

  try {
    // Verifica se o ingresso existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado.' });
    }

    // Verifica se há estoque suficiente
    if (ticket.quantity < quantity) {
      return res.status(400).json({ error: `Quantidade solicitada excede o estoque disponível para o tipo ${ticket.type}.` });
    }

    // Atualiza o estoque do ingresso
    ticket.quantity -= quantity;
    await ticket.save();

    // Registra a compra no banco de dados
    const purchase = await Purchase.create({
      userId,
      ticketId,
      quantity,
      clientCode,
      clientName,
      clientPhone,
      clientEmail,
      status: 'concluída',
    });

    res.status(201).json({ message: 'Compra realizada com sucesso!', purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a compra.' });
  }
};

exports.cancelPurchase = async (req, res) => {
  const { purchaseId } = req.params;

  try {
    const purchase = await Purchase.findByPk(purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: 'Compra não encontrada.' });
    }

    // Regra de negócio: Verifica se a compra pode ser cancelada
    if (purchase.status !== 'pendente') {
      return res.status(400).json({ error: 'Apenas compras pendentes podem ser canceladas.' });
    }

    // Regra de negócio: Verifica se a compra já foi concluída
    if (purchase.status === 'concluída') {
      return res.status(400).json({ error: 'Compras concluídas não podem ser canceladas.' });
    }

    // Cancela a compra
    purchase.status = 'cancelada';
    await purchase.save();

    res.status(200).json({ message: 'Compra cancelada com sucesso!', purchase });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar a compra.' });
  }
};