-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RequestToJoinAccepted', 'RequestToJoinRejected');

-- CreateEnum
CREATE TYPE "NotificationSeenStatus" AS ENUM ('NotSeen', 'Seen', 'Done');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "seenStatus" "NotificationSeenStatus" NOT NULL DEFAULT E'NotSeen',
    "userId" TEXT NOT NULL,
    "commonId" TEXT,
    "proposalId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
