PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- Обновляем для каждого тура поле imgs_path на "/images/{id}"
UPDATE tours
SET imgs_path = '/images/' || id;

COMMIT;
PRAGMA foreign_keys = ON;
