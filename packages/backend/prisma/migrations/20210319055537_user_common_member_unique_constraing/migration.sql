/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[userId,commonId]` on the table `CommonMember`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommonMember.userId_commonId_unique" ON "CommonMember"("userId", "commonId");
