// routes/inquiries.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inquiryController');

// Приём обращений
router.post('/', ctrl.addInquiry);

module.exports = router;
