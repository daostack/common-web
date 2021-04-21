/*
  Warnings:

  - Added the required column `commonId` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion"
    ADD COLUMN "commonId"   TEXT NOT NULL,
    ADD COLUMN "proposalId" TEXT;

-- AddForeignKey
ALTER TABLE "Discussion"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion"
    ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
