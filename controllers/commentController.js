// controllers/commentController.js
const Comment = require('../models/commentModel');
const User    = require('../models/userModel');

// GET /api/comments
exports.getComments = (req, res) => {
  try {
    const comments = Comment.getAll();
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось загрузить отзывы' });
  }
};

// POST /api/comments
exports.addComment = async (req, res) => {
  // Только для авторизованных
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Нужно войти в систему' });
  }

  const { comment } = req.body;
  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'Комментарий не может быть пустым' });
  }

  try {
    // Берём имя/почту из профиля, чтобы никто не подменял
    const user = User.getById(req.session.userId);
    if (!user) throw new Error('Пользователь не найден');

    const id = Comment.create(user.fullName, user.email, comment.trim());
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Не удалось сохранить отзыв' });
  }
};
