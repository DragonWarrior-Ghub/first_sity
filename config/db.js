// config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'DB', 'DB.sqlite');
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Ошибка подключения к БД', err);
  else console.log('✔ Connected to SQLite:', dbPath);
});

module.exports = db;
