// controllers/inquiryController.js
const Inquiry = require('../models/inquiryModel');

/**
 * POST /api/inquiries
 * Тело формы: { name, email, subject, message, phone }
 */
exports.addInquiry = (req, res) => {
  const { name, email, subject, message, phone } = req.body;

  // Простая валидация
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Имя, email и сообщение обязательны' });
  }

  try {
    const id = Inquiry.createInquiry(
      name.trim(),
      email.trim(),
      subject ? subject.trim() : '',
      message.trim(),
      phone ? phone.trim() : ''
    );
    res.status(201).json({ id });
  } catch (err) {
    console.error('Failed to save inquiry:', err);
    res.status(500).json({ error: 'Не удалось сохранить обращение' });
  }
};
