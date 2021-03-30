/*
  Warnings:

  - Added the required column `fundingType` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JoinProposal" ADD COLUMN     "fundingType" "FundingType" NOT NULL;
