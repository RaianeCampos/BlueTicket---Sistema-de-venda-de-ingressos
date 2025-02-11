const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});
// Rota para logout
router.post('/logout', authController.logout);

module.exports = router;