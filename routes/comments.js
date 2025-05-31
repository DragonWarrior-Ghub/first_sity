// routes/comments.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/commentController');

// получить все отзывы (публично)
router.get('/', ctrl.getComments);

// добавить отзыв (только залогин)
router.post('/', ctrl.addComment);

module.exports = router;
