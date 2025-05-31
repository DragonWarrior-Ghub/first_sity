// controllers/authController.js
const bcrypt = require('bcrypt');
const User   = require('../models/userModel');
const Cart   = require('../models/cartModel');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  const { fullName, phone, email, password, confirmPassword, agree } = req.body;

  // 1) Проверяем обязательные поля
  if (!fullName || !phone || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  // 2) Подтверждение пароля
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Пароли не совпадают' });
  }
  // 3) Согласие с политикой
  if (!agree) {
    return res.status(400).json({ error: 'Нужно согласиться с политикой конфиденциальности' });
  }
  // 4) Проверяем уникальность email
  if (User.findByIdentifier(email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }

  try {
    const hash   = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = User.createUser(fullName, email, hash, phone);
    Cart.createCart(userId);              // создаём корзину
    req.session.userId = userId;
    res.json({ id: userId, fullName, email, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Нужно указать email и пароль' });
  }
  const user = User.findByIdentifier(identifier);
  if (!user) {
    return res.status(400).json({ error: 'Неверный логин или пароль' });
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(400).json({ error: 'Неверный логин или пароль' });
  }
  req.session.userId = user.id;
  res.json({ id: user.id, fullName: user.full_name, email: user.email, phone: user.phone });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Не удалось выйти' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Вы вышли из аккаунта' });
  });
};

exports.me = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  const user = User.getById(req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  res.json(user);
};

exports.updateProfile = (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Нужно войти в систему' });
  }

  const { fullName, email, phone } = req.body;
  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  // Проверить, что email не занят другим
  const existing = User.findByIdentifier(email);
  if (existing && existing.id !== userId) {
    return res.status(400).json({ error: 'Этот email уже используется' });
  }

  try {
    const updated = User.updateById(userId, fullName.trim(), email.trim(), phone.trim());
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось обновить профиль' });
  }
};