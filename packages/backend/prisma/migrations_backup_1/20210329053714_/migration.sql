/*
  Warnings:

  - You are about to drop the column `userId` on the `JoinProposal` table. All the data in the column will be lost.
  - You are about to drop the column `commonId` on the `JoinProposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinProposal" DROP COLUMN "userId",
DROP
COLUMN "commonId";
