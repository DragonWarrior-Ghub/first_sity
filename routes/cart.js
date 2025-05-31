// routes/cart.js
const express = require('express');
const router  = express.Router();
const cartCtrl = require('../controllers/cartController');

// Получить все позиции корзины текущего пользователя
router.get('/', cartCtrl.getCart);

// Добавить тур в корзину (body: { tourId })
router.post('/', cartCtrl.addToCart);

// Удалить позицию из корзины по её ID
router.delete('/:id', cartCtrl.removeItem);

module.exports = router;
