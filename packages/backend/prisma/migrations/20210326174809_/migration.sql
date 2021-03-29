/*
  Warnings:

  - You are about to drop the column `userId` on the `FundingProposal` table. All the data in the column will be lost.
  - You are about to drop the column `commonId` on the `FundingProposal` table. All the data in the column will be lost.
  - You are about to drop the column `commonMemberId` on the `FundingProposal` table. All the data in the column will be lost.
  - You are about to drop the column `proposalDescriptionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `ProposalDescription` table. If the table is not empty, all the data it contains will be lost.
  - The migration will add a unique constraint covering the columns `[commonMemberId,proposalId]` on the table `Vote`. If there are existing duplicate values, the migration will fail.
  - Added the required column `proposalId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('FundingRequest', 'JoinRequest');

-- DropForeignKey
ALTER TABLE "ProposalDescription" DROP CONSTRAINT "ProposalDescription_fundingId_fkey";

-- DropForeignKey
ALTER TABLE "ProposalDescription" DROP CONSTRAINT "ProposalDescription_joinId_fkey";

-- DropForeignKey
ALTER TABLE "FundingProposal" DROP CONSTRAINT "FundingProposal_commonId_fkey";

-- DropForeignKey
ALTER TABLE "FundingProposal" DROP CONSTRAINT "FundingProposal_commonMemberId_fkey";

-- DropForeignKey
ALTER TABLE "FundingProposal" DROP CONSTRAINT "FundingProposal_userId_fkey";

-- DropForeignKey
ALTER TABLE "JoinProposal" DROP CONSTRAINT "JoinProposal_commonId_fkey";

-- DropForeignKey
ALTER TABLE "JoinProposal" DROP CONSTRAINT "JoinProposal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_proposalDescriptionId_fkey";

-- DropIndex
DROP
INDEX "Vote.commonMemberId_proposalDescriptionId_unique";

-- AlterTable
ALTER TABLE "FundingProposal" DROP COLUMN "userId",
DROP
COLUMN "commonId",
DROP
COLUMN "commonMemberId";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "proposalDescriptionId",
ADD COLUMN     "proposalId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProposalDescription";

-- CreateTable
CREATE TABLE "Proposal"
(
    "id"             TEXT            NOT NULL,
    "createdAt"      TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)    NOT NULL,
    "title"          TEXT,
    "description"    TEXT,
    "link"           JSONB,
    "files"          JSONB,
    "images"         JSONB,
    "type"           "ProposalType"  NOT NULL,
    "state"          "ProposalState" NOT NULL DEFAULT E 'Countdown',
    "votesFor"       INTEGER         NOT NULL DEFAULT 0,
    "votesAgainst"   INTEGER         NOT NULL DEFAULT 0,
    "joinId"         TEXT,
    "fundingId"      TEXT,
    "userId"         TEXT            NOT NULL,
    "commonId"       TEXT            NOT NULL,
    "commonMemberId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE
UNIQUE INDEX "Proposal.joinId_unique" ON "Proposal"("joinId");

-- CreateIndex
CREATE
UNIQUE INDEX "Proposal.fundingId_unique" ON "Proposal"("fundingId");

-- CreateIndex
CREATE
UNIQUE INDEX "Vote.commonMemberId_proposalId_unique" ON "Vote"("commonMemberId", "proposalId");

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("joinId") REFERENCES "JoinProposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("fundingId") REFERENCES "FundingProposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote"
    ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
