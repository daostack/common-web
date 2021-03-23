/*
  Warnings:

  - Added the required column `state` to the `FundingProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `FundingProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundingProposal" ADD COLUMN     "state" "ProposalState" NOT NULL,
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "funded" BOOLEAN NOT NULL DEFAULT false;
