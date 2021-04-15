/*
  Warnings:

  - Added the required column `from` to the `NotificationTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationTemplate" ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "bcc" TEXT;
