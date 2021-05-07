/*
  Warnings:

  - You are about to drop the column `sendEmail` on the `NotificationEventSettings` table. All the data in the column will be lost.
  - You are about to drop the column `sendNotification` on the `NotificationEventSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationEventSettings" DROP COLUMN "sendEmail",
DROP COLUMN "sendNotification";
