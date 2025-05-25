// models/userModel.js
const db = require('../config/db');

function createUser(username, email, passwordHash, cb) {
  const sql = `
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [username, email, passwordHash], function(err) {
    cb(err, this && this.lastID);
  });
}

function findById(id, cb) {
  const sql = `
    SELECT id, username, email, role
      FROM users
     WHERE id = ?
  `;
  db.get(sql, [id], cb);
}

function findByUsername(username, cb) {
  const sql = `
    SELECT id, username, email, role, password_hash
      FROM users
     WHERE username = ?
  `;
  db.get(sql, [username], cb);
}

function findByEmail(email, cb) {
  const sql = `
    SELECT id, username, email, role, password_hash
      FROM users
     WHERE email = ?
  `;
  db.get(sql, [email], cb);
}

module.exports = {
  createUser,
  findById,
  findByUsername,
  findByEmail
};
