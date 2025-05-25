// routes/auth.js
const Router = require('express').Router;
const { register, login, logout, status } = require('../controllers/authController');
const router = Router();

// Проверка статуса (должно быть ДО статической отдачи)
router.get('/status', status);

router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);

module.exports = router;
