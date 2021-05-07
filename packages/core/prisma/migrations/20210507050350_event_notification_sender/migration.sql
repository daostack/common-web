-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'General';

-- CreateTable
CREATE TABLE "NotificationEventSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sendNotificationType" "NotificationType" NOT NULL,
    "onEvent" "EventType" NOT NULL,
    "sendToEveryone" BOOLEAN NOT NULL DEFAULT false,
    "sendToCommon" BOOLEAN NOT NULL DEFAULT false,
    "sendToUser" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);
