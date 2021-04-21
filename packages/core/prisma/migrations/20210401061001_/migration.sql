/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[subscriptionId]` on the table `JoinProposal`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JoinProposal_subscriptionId_unique" ON "JoinProposal"("subscriptionId");
