-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('AwaitingReview', 'ModeratorActionTaken', 'AdminActionTaken', 'Dissmissed', 'Clossed');

-- CreateEnum
CREATE TYPE "ReportFor" AS ENUM ('Nudity', 'Violance', 'Harassment', 'FalseNews', 'Spam', 'Hate', 'Other');

-- CreateEnum
CREATE TYPE "ReportAuditor" AS ENUM ('CommonModerator', 'SystemAdmin');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "for" "ReportFor" NOT NULL,
    "note" TEXT NOT NULL,
    "reviewAuthority" "ReportAuditor",
    "reviewedOn" TIMESTAMP(3),
    "messageId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reviewerId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("messageId") REFERENCES "DiscussionMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
