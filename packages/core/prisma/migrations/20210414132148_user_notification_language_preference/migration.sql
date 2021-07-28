-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationLanguage" "NotificationLanguage" NOT NULL DEFAULT E'EN';

-- CreateTable
CREATE TABLE "NotificationSystemSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "sendEmail" BOOLEAN NOT NULL DEFAULT false,
    "sendPush" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);
