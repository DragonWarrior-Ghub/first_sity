// models/userModel.js
const db = require('../config/db');

function createUser(username, email, passwordHash, role = 'volunteer') {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO participants (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [username, email, passwordHash, role], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM participants WHERE email = ?`,
      [email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

module.exports = { createUser, findByEmail };
