const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para exibir o histórico de compras
router.get('/', authMiddleware.isAuthenticated, purchaseController.getPurchaseHistory);

//Rota para exibir o formulário de compra
router.get('/purchase-form', /*authMiddleware.isAuthenticated,*/ (req, res) => {
    const ticketId = req.query.ticketId; // Obtém o ID do ingresso da query string
    res.render('purchaseForm', { ticketId });
  });

// Rota para comprar ingressos (protegida por autenticação)
router.post('/purchase', authMiddleware.isAuthenticated, purchaseController.processPurchase);
// Rota para cancelar compras
router.put('/purchase/:purchaseId/cancel', authMiddleware.isAuthenticated, purchaseController.cancelPurchase);
router.delete('/purchase/:purchaseId', authMiddleware.isAuthenticated, purchaseController.cancelPurchase);
module.exports = router;