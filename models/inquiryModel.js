// models/inquiryModel.js
const path     = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../DB/DB_answer.sqlite');
console.log('Opening Inquiries DB at', dbPath);
const db     = new Database(dbPath);

/**
 * Сохраняет новое обращение в таблицу inquiries
 * @returns {number} id созданного обращения
 */
function createInquiry(fullName, email, subject, message, phone) {
  const stmt = db.prepare(`
    INSERT INTO inquiries
      (full_name, email, subject, message, phone)
    VALUES
      (?,        ?,     ?,       ?,       ?)
  `);
  const info = stmt.run(fullName, email, subject, message, phone);
  return info.lastInsertRowid;
}

module.exports = { createInquiry };
