/*
  Warnings:

  - Added the required column `emailSentStatus` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pushSentStatus` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationSendStatus" AS ENUM ('NotRequired', 'Pending', 'Sent');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "emailSentStatus" "NotificationSendStatus" NOT NULL,
ADD COLUMN     "pushSentStatus" "NotificationSendStatus" NOT NULL;
