-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CryptoCurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "icon_link" TEXT,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_CryptoCurrency" ("icon_link", "id", "title", "type", "value") SELECT "icon_link", "id", "title", "type", "value" FROM "CryptoCurrency";
DROP TABLE "CryptoCurrency";
ALTER TABLE "new_CryptoCurrency" RENAME TO "CryptoCurrency";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
