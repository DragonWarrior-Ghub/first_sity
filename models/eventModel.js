// models/eventModel.js
const { db } = require('../config/db');

exports.getAllEvents = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM events`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.createEvent = ({ title, description, start_time, end_time, max_participants, organizer_id }) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO events
        (title, description, start_time, end_time, max_participants, organizer_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [title, description, start_time, end_time, max_participants, organizer_id], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

/**
 * Регистрирует пользователя на событие, но только если он ещё не регистрировался.
 * @param {number} eventId 
 * @param {number} userId
 */
exports.registerUser = (eventId, userId) => {
  return new Promise((resolve, reject) => {
    // 1) проверяем, есть ли уже запись
    db.get(
      `SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?`,
      [eventId, userId],
      (err, row) => {
        if (err) return reject(err);
        if (row) {
          // уже зарегистрирован
          return reject({ code: 'ALREADY_REGISTERED' });
        }
        const now = new Date().toISOString();
        // 2) вставляем регистрацию
        db.run(
          `INSERT INTO event_registrations (event_id, user_id, registration_date) VALUES (?, ?, ?)`,
          [eventId, userId, now],
          function(err2) {
            if (err2) return reject(err2);
            // 3) увеличиваем счётчик в events
            db.run(
              `UPDATE events SET registered_count = registered_count + 1 WHERE id = ?`,
              [eventId],
              function(err3) {
                if (err3) return reject(err3);
                resolve({ registrationId: this.lastID });
              }
            );
          }
        );
      }
    );
  });
};
