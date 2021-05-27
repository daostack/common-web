-- AlterTable
ALTER TABLE "NotificationEventSettings" ADD COLUMN     "sendEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sendNotification" BOOLEAN NOT NULL DEFAULT false;
