-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "discussionId" TEXT,
ADD COLUMN     "proposalId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
