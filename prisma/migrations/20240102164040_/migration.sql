/*
  Warnings:

  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostTypeEnum" AS ENUM ('PUBLISHED', 'SAVED');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "description",
DROP COLUMN "metaTitle",
DROP COLUMN "updatedAt",
ADD COLUMN     "type" "PostTypeEnum" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
