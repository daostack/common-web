/*
  Warnings:

  - You are about to drop the column `payoutId` on the `Proposal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proposal"
    DROP CONSTRAINT "Proposal_payoutId_fkey";

-- AlterTable
ALTER TABLE "FundingProposal"
    ADD COLUMN "payoutId" TEXT;

-- AlterTable
ALTER TABLE "Proposal"
    DROP COLUMN "payoutId";

-- AddForeignKey
ALTER TABLE "FundingProposal"
    ADD FOREIGN KEY ("payoutId") REFERENCES "Payout" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
