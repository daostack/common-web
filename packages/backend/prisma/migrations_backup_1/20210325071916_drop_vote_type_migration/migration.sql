/*
  Warnings:

  - You are about to drop the column `type` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "type";

-- DropEnum
DROP TYPE "VoteType";
