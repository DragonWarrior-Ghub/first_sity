-- Инициализация новой БД (выполните в директории с проектом):
-- sqlite3 DB_answer.sqlite < init_answer.sql

-- init_answer.sql

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- 1) Таблица для обращений
CREATE TABLE IF NOT EXISTS inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  subject     TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2) Таблица для пользовательских комментариев
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  comment     TEXT    NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
PRAGMA foreign_keys = ON;
