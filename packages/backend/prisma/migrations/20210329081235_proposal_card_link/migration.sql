/*
  Warnings:

  - Added the required column `cardId` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JoinProposal"
    ADD COLUMN "cardId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JoinProposal"
    ADD FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
