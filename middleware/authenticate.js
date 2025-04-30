// middleware/authenticate.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;    // { id, username, role }
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(403).json({ message: 'Неверный или истёкший токен' });
  }
};
