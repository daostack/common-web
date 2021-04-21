/*
  Warnings:

  - You are about to drop the column `usedStubs` on the `NotificationTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationTemplate" DROP COLUMN "usedStubs",
ADD COLUMN     "stubs" TEXT[];
