/*
  Warnings:

  - Changed the type of `paymentState` on the `JoinProposal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "JoinProposal" DROP COLUMN "paymentState",
ADD COLUMN     "paymentState" "ProposalPaymentState" NOT NULL;
