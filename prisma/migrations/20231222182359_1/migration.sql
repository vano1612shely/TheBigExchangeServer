-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "phone" TEXT,
    "telegram" TEXT,
    "telegramBot" TEXT,
    "instagram" TEXT,
    "address" TEXT,
    "telegramBotApi" TEXT,
    "telegramChatId" TEXT,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Украина',
    "city_name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoCurrency" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon_link" TEXT,
    "value" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,

    CONSTRAINT "CryptoCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_link" TEXT,

    CONSTRAINT "Banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "telegram" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "clientId" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientRequest" (
    "id" SERIAL NOT NULL,
    "giveCurrency" TEXT NOT NULL,
    "getCurrency" TEXT NOT NULL,
    "giveSum" DOUBLE PRECISION NOT NULL,
    "getSum" DOUBLE PRECISION NOT NULL,
    "exchange" DOUBLE PRECISION NOT NULL,
    "client_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL DEFAULT 'site',
    "status" TEXT DEFAULT 'in_process',
    "requestId" TEXT,

    CONSTRAINT "ClientRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChainToCryptoCurrency" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_name_telegram_key" ON "Client"("phone", "name", "telegram");

-- CreateIndex
CREATE UNIQUE INDEX "ClientRequest_requestId_key" ON "ClientRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChainToCryptoCurrency_AB_unique" ON "_ChainToCryptoCurrency"("A", "B");

-- CreateIndex
CREATE INDEX "_ChainToCryptoCurrency_B_index" ON "_ChainToCryptoCurrency"("B");

-- AddForeignKey
ALTER TABLE "ClientRequest" ADD CONSTRAINT "ClientRequest_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChainToCryptoCurrency" ADD CONSTRAINT "_ChainToCryptoCurrency_A_fkey" FOREIGN KEY ("A") REFERENCES "Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChainToCryptoCurrency" ADD CONSTRAINT "_ChainToCryptoCurrency_B_fkey" FOREIGN KEY ("B") REFERENCES "CryptoCurrency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
