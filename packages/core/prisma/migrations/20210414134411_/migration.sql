/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `NotificationSystemSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationSystemSettings.type_unique" ON "NotificationSystemSettings"("type");
