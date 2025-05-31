// routes/tours.js
const router = require('express').Router();
const ctrl   = require('../controllers/tourController');

// GET /api/tours — вернуть весь список
router.get('/', ctrl.getAll);

// GET /api/tours/:id — вернуть один тур по ID
router.get('/:id', ctrl.getById);

module.exports = router;
