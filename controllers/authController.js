// controllers/authController.js
const bcrypt = require('bcrypt');
const { createUser, findById, findByUsername, findByEmail } = require('../models/userModel');
const saltRounds = 10;

// Регистрация
async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  findByUsername(username, (err, row1) => {
    if (row1) return res.status(409).json({ error: 'Имя занято' });
    findByEmail(email, (err, row2) => {
      if (row2) return res.status(409).json({ error: 'Email уже используется' });
      bcrypt.hash(password, saltRounds, (err, hash) => {
        createUser(username, email, hash, (err, userId) => {
          if (err) return res.status(500).json({ error: 'Не удалось создать' });
          req.session.userId = userId;
          res.json({ success: true, userId });
        });
      });
    });
  });
}

// Логин
function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  findByEmail(email, (err, user) => {
    if (!user) return res.status(401).json({ error: 'Неверные учётные данные' });
    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (!match) return res.status(401).json({ error: 'Неверные учётные данные' });
      req.session.userId = user.id;
      res.json({ success: true });
    });
  });
}

// Выход
function logout(req, res) {
  req.session.destroy(() => res.json({ success: true }));
}

// Статус аутентификации
function status(req, res) {
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }
  findById(req.session.userId, (err, user) => {
    if (err || !user) {
      return res.json({ authenticated: false });
    }
    // Возвращаем и username, и email
    res.json({
      authenticated: true,
      username: user.username,
      email: user.email
    });
  });
}

module.exports = { register, login, logout, status };
