/*
  Warnings:

  - You are about to drop the column `proposalId` on the `Payment` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[joinId]` on the table `Payment`. If there are existing duplicate values, the migration will fail.
  - Added the required column `joinId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_proposalId_fkey";

-- DropIndex
DROP INDEX "Payment_proposalId_unique";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "proposalId",
ADD COLUMN     "joinId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_joinId_unique" ON "Payment"("joinId");

-- AddForeignKey
ALTER TABLE "Payment" ADD FOREIGN KEY ("joinId") REFERENCES "JoinProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
