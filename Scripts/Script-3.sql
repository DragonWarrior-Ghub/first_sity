PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- 1) Добавляем колонку только если её нет
--   SQLite не поддерживает IF NOT EXISTS для ALTER, поэтому проверяем руками:
CREATE TABLE IF NOT EXISTS temp_tours_schema (
  category_exists INTEGER
);

INSERT INTO temp_tours_schema
  SELECT COUNT(*)
  FROM pragma_table_info('tours')
  WHERE name = 'category';

-- Если category не существует, добавляем
DELETE FROM temp_tours_schema WHERE category_exists > 0;
-- Если остались строки, значит колонки нет
INSERT INTO temp_tours_schema DEFAULT VALUES;
-- Если здесь одна строка, то нужно выполнить ALTER
SELECT CASE WHEN (SELECT COUNT(*) FROM temp_tours_schema) = 2
THEN
  'ALTER'
ELSE
  'NOALTER'
END AS action;

-- Ручное добавление (если вы уверены, что повторно ALTER не сломает схему, просто выполните всегда):
ALTER TABLE tours
  ADD COLUMN category TEXT DEFAULT 'Стандарт';

-- 2) Теперь надёжно обновляем категории, приводя price к числу
UPDATE tours
SET category = 'Эконом'
WHERE CAST(REPLACE(REPLACE(price, '₽', ''), ' ', '') AS INTEGER) < 50000;

UPDATE tours
SET category = 'Стандарт'
WHERE CAST(REPLACE(REPLACE(price, '₽', ''), ' ', '') AS INTEGER) BETWEEN 50000 AND 150000;

UPDATE tours
SET category = 'Премиум'
WHERE CAST(REPLACE(REPLACE(price, '₽', ''), ' ', '') AS INTEGER) > 150000;

COMMIT;
PRAGMA foreign_keys = ON;

-- 3) Проверка результатов
SELECT id, title, price, category
FROM tours
ORDER BY price + 0;
