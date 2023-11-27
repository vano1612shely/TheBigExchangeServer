/*
  Warnings:

  - You are about to drop the column `exchange` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `percent` on the `Info` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CryptoCurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "icon_link" TEXT,
    "value" TEXT NOT NULL,
    "percent" REAL NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL
);
INSERT INTO "new_CryptoCurrency" ("icon_link", "id", "title", "type", "value") SELECT "icon_link", "id", "title", "type", "value" FROM "CryptoCurrency";
DROP TABLE "CryptoCurrency";
ALTER TABLE "new_CryptoCurrency" RENAME TO "CryptoCurrency";
CREATE TABLE "new_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "telegram" TEXT,
    "telegramBot" TEXT,
    "instagram" TEXT,
    "address" TEXT,
    "telegramBotApi" TEXT,
    "telegramChatId" TEXT
);
INSERT INTO "new_Info" ("address", "id", "instagram", "phone", "telegram", "telegramBot", "telegramBotApi", "telegramChatId") SELECT "address", "id", "instagram", "phone", "telegram", "telegramBot", "telegramBotApi", "telegramChatId" FROM "Info";
DROP TABLE "Info";
ALTER TABLE "new_Info" RENAME TO "Info";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
