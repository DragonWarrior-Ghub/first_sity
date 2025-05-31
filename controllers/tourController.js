// controllers/tourController.js
const fs   = require('fs');
const path = require('path');
const Tour = require('../models/tourModel');

exports.getAll = (req, res) => {
  const search = req.query.q || '';
  res.json(Tour.getAll(search));
};

exports.getById = (req, res) => {
  const id = Number(req.params.id);
  const tour = Tour.getById(id);
  if (!tour) {
    return res.status(404).json({ error: 'Тур не найден' });
  }

  // Убираем ведущие слэши из imgs_path
  let imgsDir = (tour.imgs_path || '').replace(/^\/+/, '');
  // Получаем реальную папку внутри public/
  const publicDir = path.join(__dirname, '../public', imgsDir);

  let gallery = [];
  try {
    const files = fs.readdirSync(publicDir);
    gallery = files
      .filter(f => /\.(jpe?g|png|gif)$/i.test(f))
      // Строим URL относительно web-root
      .map(f => '/' + path.posix.join(imgsDir, f));
  } catch (err) {
    console.warn(`Не удалось прочитать папку ${publicDir}:`, err.message);
  }

  // отдаём массив URL в поле gallery
  tour.gallery = gallery;
  delete tour.imgs_path;

  res.json(tour);
};
