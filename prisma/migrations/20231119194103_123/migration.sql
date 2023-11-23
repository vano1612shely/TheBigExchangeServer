/*
  Warnings:

  - You are about to alter the column `exchange` on the `Info` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `telegramBot` to the `Info` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Info" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "telegramBot" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "exchange" REAL NOT NULL DEFAULT 37.5,
    "address" TEXT NOT NULL
);
INSERT INTO "new_Info" ("address", "exchange", "id", "instagram", "phone", "telegram") SELECT "address", "exchange", "id", "instagram", "phone", "telegram" FROM "Info";
DROP TABLE "Info";
ALTER TABLE "new_Info" RENAME TO "Info";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
