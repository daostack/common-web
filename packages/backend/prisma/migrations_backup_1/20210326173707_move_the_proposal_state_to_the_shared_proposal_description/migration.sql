/*
  Warnings:

  - You are about to drop the column `state` on the `FundingProposal` table. All the data in the column will be lost.
  - You are about to drop the column `fundingType` on the `JoinProposal` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `JoinProposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FundingProposal" DROP COLUMN "state";

-- AlterTable
ALTER TABLE "JoinProposal" DROP COLUMN "fundingType",
DROP
COLUMN "state";

-- AlterTable
ALTER TABLE "ProposalDescription"
    ADD COLUMN "state" "ProposalState" NOT NULL DEFAULT E 'Countdown';
