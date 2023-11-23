-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "telegram" TEXT,
    "telegramBot" TEXT,
    "instagram" TEXT,
    "exchange" REAL DEFAULT 37.5,
    "address" TEXT,
    "percent" REAL NOT NULL DEFAULT 3
);
INSERT INTO "new_Info" ("address", "exchange", "id", "instagram", "phone", "telegram", "telegramBot") SELECT "address", "exchange", "id", "instagram", "phone", "telegram", "telegramBot" FROM "Info";
DROP TABLE "Info";
ALTER TABLE "new_Info" RENAME TO "Info";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
