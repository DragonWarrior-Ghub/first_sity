PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

ALTER TABLE users ADD COLUMN full_name TEXT;
ALTER TABLE users ADD COLUMN phone     TEXT;

COMMIT;
PRAGMA foreign_keys = ON;