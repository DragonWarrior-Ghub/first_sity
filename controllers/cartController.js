// controllers/cartController.js
const Cart = require('../models/cartModel');
const Tour = require('../models/tourModel');

exports.getCart = (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Не авторизован' });
  try {
    const items = Cart.getItems(req.session.userId);
    // дополняем данными тура
    const result = items.map(i => {
      const t = Tour.getById(i.tourId);
      return {
        id:       i.id,
        tourId:   i.tourId,
        title:    t.title,
        image:    t.image,
        price:    t.price,
        quantity: i.quantity
      };
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при получении корзины' });
  }
};

exports.addToCart = (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Не авторизован' });
  const { tourId } = req.body;
  if (!tourId) return res.status(400).json({ error: 'Не указан tourId' });
  try {
    const itemId = Cart.addToCart(req.session.userId, Number(tourId));
    res.json({ itemId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении в корзину' });
  }
};

exports.removeItem = (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Не авторизован' });
  const { id } = req.params;
  try {
    Cart.removeItem(Number(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при удалении из корзины' });
  }
};
