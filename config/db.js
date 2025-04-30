// config/db.js
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
require('dotenv').config();

const DB_FILE = path.join(__dirname, '..', 'DB'); // ваш файл БД без расширения

const db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    console.error('Ошибка при подключении к SQLite:', err.message);
    process.exit(1);
  }
  console.log('Подключено к SQLite:', DB_FILE);
});

// Автосоздание таблиц, если ещё нет
const initSql = `
CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'volunteer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  organizer_id INTEGER NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 0,
  registered_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES participants(id)
);
CREATE TABLE IF NOT EXISTS event_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id)  REFERENCES participants(id)
);
`;
db.exec(initSql, err => {
  if (err) console.error('Ошибка инициализации схемы БД:', err);
});

module.exports = { db };
