/*
  Warnings:

  - A unique constraint covering the columns `[onEvent]` on the table `NotificationEventSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationEventSettings.onEvent_unique" ON "NotificationEventSettings"("onEvent");
