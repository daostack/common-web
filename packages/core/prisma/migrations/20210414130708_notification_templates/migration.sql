/*
  Warnings:

  - You are about to drop the column `emailSentStatus` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `pushSentStatus` on the `Notification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationProcessStatus" AS ENUM ('NotProcessed', 'Processing', 'Processed');

-- CreateEnum
CREATE TYPE "NotificationLanguage" AS ENUM ('EN', 'RU', 'BG', 'HE', 'JP', 'KO');

-- CreateEnum
CREATE TYPE "NotificationTemplateType" AS ENUM ('PushNotification', 'EmailNotification');

-- AlterEnum
ALTER TYPE "NotificationSendStatus" ADD VALUE 'Failed';

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "emailSentStatus",
DROP COLUMN "pushSentStatus";

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "forType" "NotificationType" NOT NULL,
    "templateType" "NotificationTemplateType" NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "NotificationLanguage" NOT NULL,

    PRIMARY KEY ("id")
);
