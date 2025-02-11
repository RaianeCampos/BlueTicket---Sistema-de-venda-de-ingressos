const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const purchaseController = require('../controllers/purchaseController'); // Importação do purchaseController

const router = express.Router();
 
router.get('/purchases', authMiddleware.isAuthenticated, purchaseController.getUserPurchases);
  
module.exports = router;

