const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const purchaseController = require('../controllers/purchaseController');

// Rota para exibir o formulário de compra
router.get('/purchase-form', authMiddleware.isAuthenticated, (req, res) => {
  const ticketId = req.query.ticketId; // Obtém o ID do ingresso da query string
  res.render('purchaseForm', { ticketId });
});

// Rota para processar a compra
router.post('/purchase', authMiddleware.isAuthenticated, purchaseController.processPurchase);

module.exports = router;