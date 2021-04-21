-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "discussionId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
