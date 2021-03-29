-- AlterTable
ALTER TABLE "ProposalDescription" ADD COLUMN     "votesFor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "votesAgainst" INTEGER NOT NULL DEFAULT 0;
