// controllers/eventController.js
const Event = require('../models/eventModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    res.json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Не удалось загрузить мероприятия' });
  }
};

exports.createEvent = async (req, res) => {
  const organizer_id = req.user.id;
  try {
    const newEv = await Event.createEvent({ ...req.body, organizer_id });
    res.status(201).json(newEv);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Не удалось создать мероприятие' });
  }
};

// Новая функция: регистрация волонтёра на событие
exports.registerEvent = async (req, res) => {
  const eventId = +req.params.id;
  const userId  = req.user.id;

  try {
    const result = await Event.registerUser(eventId, userId);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'ALREADY_REGISTERED') {
      return res.status(400).json({ message: 'Вы уже зарегистрированы на это мероприятие' });
    }
    console.error(err);
    res.status(500).json({ message: 'Не удалось зарегистрироваться на мероприятие' });
  }
};
