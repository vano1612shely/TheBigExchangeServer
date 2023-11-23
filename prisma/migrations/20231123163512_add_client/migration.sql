-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "telegram" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT
);
