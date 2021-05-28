/*
  Warnings:

  - A unique constraint covering the columns `[userId,payoutId]` on the table `PayoutApprover` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PayoutApprover.userId_payoutId_unique" ON "PayoutApprover" ("userId", "payoutId");
