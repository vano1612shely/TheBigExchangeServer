-- AlterTable
ALTER TABLE "Info" ADD COLUMN "telegramBotApi" TEXT;

-- CreateTable
CREATE TABLE "Banks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon_link" TEXT
);
