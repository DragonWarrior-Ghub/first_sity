// routes/auth.js
const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');

// Регистрация, вход, выход
router.post('/register', auth.register);
router.post('/login',    auth.login);
router.post('/logout',   auth.logout);

// Получение профиля и его обновление
router.get('/me',        auth.me);
router.put('/me',        auth.updateProfile);

module.exports = router;