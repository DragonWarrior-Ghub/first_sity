// models/userModel.js
const path     = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../DB/DB_users');
console.log('Opening User DB at', dbPath);
const db     = new Database(dbPath);

// Создать пользователя
function createUser(fullName, email, passwordHash, phone) {
  const stmt = db.prepare(`
    INSERT INTO users (full_name, username, email, password_hash, phone)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(fullName, email, email, passwordHash, phone);
  return info.lastInsertRowid;
}

// Найти по username или email
function findByIdentifier(identifier) {
  return db
    .prepare(`SELECT * FROM users WHERE username = ? OR email = ?`)
    .get(identifier, identifier);
}

// Получить профиль без пароля
function getById(id) {
  return db
    .prepare(`
      SELECT
        id,
        full_name  AS fullName,
        email,
        phone,
        created_at
      FROM users
      WHERE id = ?
    `)
    .get(id);
}

// Обновить профиль
function updateById(id, fullName, email, phone) {
  const stmt = db.prepare(`
    UPDATE users
       SET full_name = ?,
           email     = ?,
           phone     = ?
     WHERE id = ?
  `);
  stmt.run(fullName, email, phone, id);
  return getById(id);
}

module.exports = {
  createUser,
  findByIdentifier,
  getById,
  updateById,    // <-- обязательно экспортируем
};
