-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('FundingProposalVote', 'JoinProposalVote');

-- CreateEnum
CREATE TYPE "VoteOutcome" AS ENUM ('Approve', 'Condemn');

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "VoteType" NOT NULL,
    "outcome" "VoteOutcome" NOT NULL,
    "commonId" TEXT NOT NULL,
    "commonMemberId" TEXT NOT NULL,
    "proposalDescriptionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote.commonMemberId_proposalDescriptionId_unique" ON "Vote"("commonMemberId", "proposalDescriptionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("proposalDescriptionId") REFERENCES "ProposalDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
