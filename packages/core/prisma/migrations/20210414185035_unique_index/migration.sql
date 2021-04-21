/*
  Warnings:

  - A unique constraint covering the columns `[forType,templateType,language]` on the table `NotificationTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NotificationTemplate" ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "fromName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate.forType_templateType_language_unique" ON "NotificationTemplate"("forType", "templateType", "language");
