/*
  Warnings:

  - Added the required column `wireId` to the `Payout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "wireId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payout" ADD FOREIGN KEY ("wireId") REFERENCES "Wire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
