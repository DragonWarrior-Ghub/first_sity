// server.js
require('dotenv').config();
const path    = require('path');
const express = require('express');
const cors    = require('cors');

require('./config/db'); // инициализируем базу

const authRoutes  = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const chatRoutes  = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
