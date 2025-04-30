// routes/eventRoutes.js
const express    = require('express');
const router     = express.Router();
const ev         = require('../controllers/eventController');
const authenticate = require('../middleware/authenticate');
const authorize    = require('../middleware/authorize');

router.get('/events', ev.getEvents);

// создание — только организатор
router.post('/events',
  authenticate,
  authorize('organizer'),
  ev.createEvent
);

// регистрация волонтёра (role 'volunteer' или любой авторизованный пользователь)
router.post('/events/:id/register',
  authenticate,
  ev.registerEvent
);

module.exports = router;
