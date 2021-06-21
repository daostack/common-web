/*
  Warnings:

  - The values [JoinRequestAccepted,JoinRequestRejected] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'HourlyStatisticCreated';
ALTER TYPE "EventType" ADD VALUE 'DailyStatisticCreated';

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('General', 'CommonWhitelisted', 'CommonCreated', 'FundingRequestCreated', 'FundingRequestAccepted', 'FundingRequestExecuted', 'FundingRequestRejected', 'MessageCreated', 'CommonMemberAdded', 'RequestToJoinCreated', 'RequestToJoinRejected', 'DiscussionCreated', 'ProposalReported', 'DiscussionReported', 'DiscussionMessageReported', 'WelcomeNotification');
ALTER TABLE "NotificationEventSettings" ALTER COLUMN "sendNotificationType" TYPE "NotificationType_new" USING ("sendNotificationType"::text::"NotificationType_new");
ALTER TABLE "NotificationSystemSettings" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TABLE "NotificationTemplate" ALTER COLUMN "forType" TYPE "NotificationType_new" USING ("forType"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
