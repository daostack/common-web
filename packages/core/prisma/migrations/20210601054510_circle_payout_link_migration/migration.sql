/*
  Warnings:

  - A unique constraint covering the columns `[circlePayoutId]` on the table `Payout` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "circlePayoutId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payout.circlePayoutId_unique" ON "Payout"("circlePayoutId");
