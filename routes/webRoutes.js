const express = require('express');
const webController = require('../controllers/webController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para a página de login
router.get('/login', webController.showLoginPage);

// Rota para a página de registro (opcional)
router.get('/register', webController.showRegisterPage);

// Rota para o histórico de compras (protegida por autenticação)
router.get('/purchases', authMiddleware.isAuthenticated, webController.showPurchaseHistory);

// Rota para detalhes de um ingresso
router.get('/tickets/:id', webController.showTicketDetails);

module.exports = router;