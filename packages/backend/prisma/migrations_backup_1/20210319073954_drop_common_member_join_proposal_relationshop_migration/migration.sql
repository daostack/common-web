/*
  Warnings:

  - You are about to drop the column `commonMemberId` on the `JoinProposal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "JoinProposal" DROP CONSTRAINT "JoinProposal_commonMemberId_fkey";

-- AlterTable
ALTER TABLE "JoinProposal" DROP COLUMN "commonMemberId";
