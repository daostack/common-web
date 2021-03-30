/*
  Warnings:

  - The migration will remove the values [PaymentConfirmed,PaymentRejected,PaymentPaid,PaymentStateChange] on the enum `EventType`. If these variants are still used in the database, the migration will fail.
  - The migration will remove the values [Confirmed,Paid,Failed] on the enum `PaymentStatus`. If these variants are still used in the database, the migration will fail.
  - The migration will remove the values [SubscriptionPayment] on the enum `PaymentType`. If these variants are still used in the database, the migration will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentCircleStatus" AS ENUM ('pending', 'failed', 'confirmed', 'paid');

-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CommonCreated', 'CommonMemberCreated', 'CommonMemberRoleAdded', 'CommonMemberRoleRemoved', 'JoinRequestCreated', 'JoinRequestAccepted', 'JoinRequestRejected', 'FundingRequestCreated', 'FundingRequestAccepted', 'FundingRequestRejected', 'CardCreated', 'CardCvvVerificationPassed', 'CardCvvVerificationFailed', 'PaymentCreated', 'PaymentSucceeded', 'PaymentFailed', 'ProposalMajorityReached', 'ProposalExpired', 'VoteCreated', 'UserCreated');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('NotAttempted', 'Pending', 'Successful', 'Unsuccessful');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TABLE "Payment" ALTER COLUMN "status" SET  DEFAULT E'NotAttempted';
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('OneTimePayment', 'SubscriptionInitialPayment', 'SubscriptionSequentialPayment');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "circlePaymentStatus" "PaymentCircleStatus";
