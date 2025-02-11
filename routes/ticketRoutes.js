const express = require('express');
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const Ticket = require('../models/Ticket');

const router = express.Router();

// Rota para listar ingressos (protegida por autenticação)
router.get('/', authMiddleware.isAuthenticated, ticketController.getAllTickets);
router.get('/api', authMiddleware.isAuthenticated, ticketController.getAllTicketsJSON);

// Rota para exibir os detalhes de um ticket específico
router.get('/:id', ticketController.getTicketDetails);

router.post('/', authMiddleware.isAuthenticated, authMiddleware.isAdmin, ticketController.createTicket);
router.put('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, ticketController.updateTicket);
router.delete('/:id', authMiddleware.isAdmin, ticketController.deleteTicket);

module.exports = router;