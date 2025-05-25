// server.js
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

const app = express();

// Парсеры
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Сессии
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './DB' }),
  secret: 'ваш_секрет_для_сессий',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 }
}));

// Роуты аутентификации (включая /status)
app.use('/api/auth', require('./routes/auth'));

// Отдача статики
app.use(express.static(path.join(__dirname, 'public')));

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
