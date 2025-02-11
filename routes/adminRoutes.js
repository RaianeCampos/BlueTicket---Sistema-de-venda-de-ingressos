const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Página de login do administrador
router.get('/login', adminController.getAdminLogin);
router.post('/login', adminController.postAdminLogin);

// Painel do administrador (protegido)
router.get('/', authMiddleware.isAdmin, adminController.getAdminPanel);

// Rota para criar usuários
router.post('/users', authMiddleware.isAdmin, adminController.createUser);

// Rota para criar ingressos
router.post('/tickets', authMiddleware.isAdmin, adminController.createTicket);

module.exports = router;