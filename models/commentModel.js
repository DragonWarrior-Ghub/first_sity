// models/commentModel.js
const path     = require('path');
const Database = require('better-sqlite3');

// Путь к файлу БД отзывов (DB_answer.sqlite)
const dbPath = path.join(__dirname, '../DB/DB_answer.sqlite');
console.log('Opening Comments DB at', dbPath);
const db     = new Database(dbPath);

// Получить все комментарии
function getAll() {
  return db.prepare(`
    SELECT
      id,
      full_name    AS fullName,
      email,
      comment,
      created_at   AS createdAt
    FROM comments
    ORDER BY created_at DESC
  `).all();
}

// Создать новый комментарий
function create(fullName, email, comment) {
  const stmt = db.prepare(`
    INSERT INTO comments (full_name, email, comment)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(fullName, email, comment);
  return info.lastInsertRowid;
}

module.exports = { getAll, create };
