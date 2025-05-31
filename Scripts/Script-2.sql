-- Добавляем новую колонку `category` в таблицу `tours`
PRAGMA foreign_keys = OFF;  -- Отключаем проверку внешних ключей на время миграции
BEGIN TRANSACTION;

ALTER TABLE tours
  ADD COLUMN category TEXT DEFAULT 'Стандарт';

-- Пример заполнения категорий на основе цены тура.
-- Настройте пороги и названия категорий под свои нужды:

UPDATE tours
SET category = CASE
  WHEN price < 50000  THEN 'Эконом'
  WHEN price BETWEEN 50000 AND 150000 THEN 'Стандарт'
  WHEN price > 150000 THEN 'Премиум'
  ELSE 'Стандарт'
END;

COMMIT;
PRAGMA foreign_keys = ON;
