/*
  Warnings:

  - A unique constraint covering the columns `[phone,name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "ClientRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "giveCurrency" TEXT NOT NULL,
    "getCurrency" TEXT NOT NULL,
    "giveSum" REAL NOT NULL,
    "getSum" REAL NOT NULL,
    "exchange" REAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    CONSTRAINT "ClientRequest_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_name_key" ON "Client"("phone", "name");
