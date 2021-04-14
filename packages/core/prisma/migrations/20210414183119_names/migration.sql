/*
  Warnings:

  - Added the required column `fromName` to the `NotificationTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationTemplate" ADD COLUMN     "fromName" TEXT NOT NULL,
ADD COLUMN     "bccName" TEXT;
