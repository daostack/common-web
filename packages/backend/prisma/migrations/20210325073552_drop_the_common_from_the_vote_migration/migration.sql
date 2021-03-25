/*
  Warnings:

  - You are about to drop the column `commonId` on the `Vote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_commonId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "commonId";
