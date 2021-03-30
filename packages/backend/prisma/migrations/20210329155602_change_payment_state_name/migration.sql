/*
  Warnings:

  - The migration will remove the values [Successful,Unsuccessful] on the enum `ProposalPaymentState`. If these variants are still used in the database, the migration will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalPaymentState_new" AS ENUM ('NotAttempted', 'Pending', 'Confirmed', 'Failed');
ALTER TABLE "JoinProposal" ALTER COLUMN "paymentState" DROP DEFAULT;
ALTER TABLE "JoinProposal" ALTER COLUMN "paymentState" TYPE "ProposalPaymentState_new" USING ("paymentState"::text::"ProposalPaymentState_new");
ALTER TABLE "JoinProposal" ALTER COLUMN "paymentState" SET  DEFAULT E'NotAttempted';
ALTER TYPE "ProposalPaymentState" RENAME TO "ProposalPaymentState_old";
ALTER TYPE "ProposalPaymentState_new" RENAME TO "ProposalPaymentState";
DROP TYPE "ProposalPaymentState_old";
COMMIT;
