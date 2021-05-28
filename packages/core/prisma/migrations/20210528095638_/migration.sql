/*
  Warnings:

  - You are about to drop the column `resonse` on the `PayoutApprover` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PayoutApprover"
    DROP COLUMN "resonse",
    ADD COLUMN "outcome" "PayoutApproverResponse" NOT NULL DEFAULT E'Pending';
