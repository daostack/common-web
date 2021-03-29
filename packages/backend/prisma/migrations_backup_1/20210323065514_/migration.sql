/*
  Warnings:

  - The migration will remove the values [FundignRequestCreated] on the enum `EventType`. If these variants are still used in the database, the migration will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CommonCreated', 'CommonMemberCreated', 'CommonMemberRoleAdded', 'CommonMemberRoleRemoved', 'JoinRequestCreated', 'FundingRequestCreated', 'CardCreated', 'CardCvvVerificationPassed', 'CardCvvVerificationFailed', 'UserCreated');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
