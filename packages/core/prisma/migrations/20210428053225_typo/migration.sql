/*
  Warnings:

  - You are about to drop the column `fundingProposasls` on the `Statistic` table. All the data in the column will be lost.
  - Added the required column `fundingProposals` to the `Statistic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Statistic" DROP COLUMN "fundingProposasls",
ADD COLUMN     "fundingProposals" INTEGER NOT NULL;
