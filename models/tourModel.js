const path     = require('path');
const Database = require('better-sqlite3');

// Путь к файлу вашей SQLite-базы
const dbPath = path.join(__dirname, '../DB/DB.sqlite');
console.log('Opening SQLite DB at', dbPath);

// Открываем БД в режиме только для чтения
const db = new Database(dbPath, { readonly: true });

module.exports = {
  // Возвращает массив всех туров (если search === пусто — без фильтра)
  getAll(search = '') {
    if (search) {
      const stmt = db.prepare(`
        SELECT
          id,
          title,
          category,
          shortDesc,
          fullDesc,
          image,        -- путь к превью
          imgs_path,    -- JSON-массив путей для галереи
          price,
          min_people  AS minPeople,
          max_people  AS maxPeople
        FROM tours
        WHERE title LIKE ?
        ORDER BY id DESC
      `);
      return stmt.all(`%${search}%`);
    }
    return db.prepare(`
      SELECT
        id,
        title,
        category,
        shortDesc,
        fullDesc,
        image,
        imgs_path,
        price,
        min_people  AS minPeople,
        max_people  AS maxPeople
      FROM tours
      ORDER BY id DESC
    `).all();
  },

  // Возвращает один тур по его ID
  getById(id) {
    return db.prepare(`
      SELECT
        id,
        title,
        category,
        shortDesc,
        fullDesc,
        image,
        imgs_path,
        price,
        min_people  AS minPeople,
        max_people  AS maxPeople
      FROM tours
      WHERE id = ?
    `).get(id);
  }
};
