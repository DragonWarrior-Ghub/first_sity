// server.js
const path        = require('path');
const express     = require('express');
const session     = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const authRouter       = require('./routes/auth');
const toursRouter      = require('./routes/tours');
const cartRouter       = require('./routes/cart');
const commentsRouter   = require('./routes/comments');
const inquiriesRouter  = require('./routes/inquiries');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './DB' }),
  secret: 'ваш_секрет_для_сессий',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 день
}));

// API routes
app.use('/api/auth',       authRouter);
app.use('/api/tours',      toursRouter);
app.use('/api/cart',       cartRouter);
app.use('/api/comments',   commentsRouter);
app.use('/api/inquiries',  inquiriesRouter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
