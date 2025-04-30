// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { db } = require('../config/db');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO participants (username, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
      [username, email, hash, role || 'volunteer'],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Ошибка регистрации' });
        }
        res.status(201).json({
          id: this.lastID, username, email, role: role || 'volunteer'
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Серверная ошибка' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    db.get(
      `SELECT id, username, password_hash, role
         FROM participants WHERE email = ?`,
      [email],
      async (err, row) => {
        if (err) return res.status(500).json({ message: 'Серверная ошибка' });
        if (!row) return res.status(401).json({ message: 'Неверный email или пароль' });
        const ok = await bcrypt.compare(password, row.password_hash);
        if (!ok) return res.status(401).json({ message: 'Неверный email или пароль' });

        const user = { id: row.id, username: row.username, role: row.role };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Серверная ошибка' });
  }
};
