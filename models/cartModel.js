// models/cartModel.js
const path     = require('path');
const Database = require('better-sqlite3');

// Используем ту же БД пользователей для корзины
const dbPath = path.join(__dirname, '../DB/DB_users');
console.log('Opening Cart DB at', dbPath);
const db     = new Database(dbPath);

// Создать пустую корзину для пользователя
function createCart(userId) {
  const stmt = db.prepare(`
    INSERT INTO carts (user_id)
    VALUES (?)
  `);
  const info = stmt.run(userId);
  return info.lastInsertRowid;
}

// Добавить тур в корзину (или увеличить количество)
function addToCart(userId, tourId) {
  // гарантируем существование корзины
  let cart = db.prepare(`SELECT id FROM carts WHERE user_id = ?`).get(userId);
  if (!cart) {
    const info = db.prepare(`INSERT INTO carts(user_id) VALUES(?)`).run(userId);
    cart = { id: info.lastInsertRowid };
  }
  const cartId = cart.id;

  const item = db.prepare(
    `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND tour_id = ?`
  ).get(cartId, tourId);
  if (item) {
    db.prepare(
      `UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?`
    ).run(item.id);
    return item.id;
  } else {
    const info = db.prepare(
      `INSERT INTO cart_items(cart_id, tour_id) VALUES(?, ?)`
    ).run(cartId, tourId);
    return info.lastInsertRowid;
  }
}

// Получить все позиции корзины текущего пользователя
function getItems(userId) {
  const cart = db.prepare(`SELECT id FROM carts WHERE user_id = ?`).get(userId);
  if (!cart) return [];
  return db.prepare(
    `SELECT id, tour_id AS tourId, quantity FROM cart_items WHERE cart_id = ?`
  ).all(cart.id);
}

// Удалить позицию из корзины по её ID
function removeItem(itemId) {
  return db.prepare(`DELETE FROM cart_items WHERE id = ?`).run(itemId);
}

module.exports = {
  createCart,
  addToCart,
  getItems,
  removeItem
};
