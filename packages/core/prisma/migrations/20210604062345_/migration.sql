/*
  Warnings:

  - The `flag` column on the `DiscussionMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('ProposalReport', 'MessageReport');

-- CreateEnum
CREATE TYPE "ReportFlag" AS ENUM ('Clear', 'Reported', 'Hidden');

-- AlterTable
ALTER TABLE "DiscussionMessage" DROP COLUMN "flag",
ADD COLUMN     "flag" "ReportFlag" NOT NULL DEFAULT E'Clear';

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "flag" "ReportFlag" NOT NULL DEFAULT E'Clear';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "type" "ReportType" NOT NULL,
ADD COLUMN     "proposalId" TEXT,
ALTER COLUMN "messageId" DROP NOT NULL;

-- DropEnum
DROP TYPE "DiscussionMessageFlag";

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
