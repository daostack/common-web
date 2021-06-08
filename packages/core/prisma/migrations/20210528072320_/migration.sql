/*
  Warnings:

  - The values [AwaitingApproval,Pending,Completed,Confirmed] on the enum `FundingState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FundingState_new" AS ENUM ('NotEligible', 'Eligible', 'Redeemed');
ALTER TABLE "FundingProposal"
    ALTER COLUMN "fundingState" DROP DEFAULT;
ALTER TABLE "FundingProposal"
    ALTER COLUMN "fundingState" TYPE "FundingState_new" USING ("fundingState"::text::"FundingState_new");
ALTER TYPE "FundingState" RENAME TO "FundingState_old";
ALTER TYPE "FundingState_new" RENAME TO "FundingState";
DROP TYPE "FundingState_old";
ALTER TABLE "FundingProposal"
    ALTER COLUMN "fundingState" SET DEFAULT 'NotEligible';
COMMIT;
