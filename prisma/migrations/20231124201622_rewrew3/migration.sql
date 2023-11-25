-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "telegram" TEXT,
    "telegramBot" TEXT,
    "instagram" TEXT,
    "exchange" REAL NOT NULL DEFAULT 37.5,
    "address" TEXT,
    "percent" REAL NOT NULL DEFAULT 3,
    "telegramBotApi" TEXT,
    "telegramChatId" TEXT
);
INSERT INTO "new_Info" ("address", "exchange", "id", "instagram", "percent", "phone", "telegram", "telegramBot", "telegramBotApi", "telegramChatId") SELECT "address", coalesce("exchange", 37.5) AS "exchange", "id", "instagram", "percent", "phone", "telegram", "telegramBot", "telegramBotApi", "telegramChatId" FROM "Info";
DROP TABLE "Info";
ALTER TABLE "new_Info" RENAME TO "Info";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
