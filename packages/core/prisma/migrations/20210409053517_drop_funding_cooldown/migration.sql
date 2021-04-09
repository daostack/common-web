/*
  Warnings:

  - You are about to drop the column `fundingCooldown` on the `Common` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Common"
    DROP COLUMN "fundingCooldown";
