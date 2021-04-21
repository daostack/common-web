/*
  Warnings:

  - The values [ReportActionTaken] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CommonCreated', 'CommonMemberCreated', 'CommonMemberRoleAdded', 'CommonMemberRoleRemoved', 'JoinRequestCreated', 'JoinRequestAccepted', 'JoinRequestRejected', 'FundingRequestCreated', 'FundingRequestAccepted', 'FundingRequestRejected', 'CardCreated', 'CardCvvVerificationPassed', 'CardCvvVerificationFailed', 'PaymentCreated', 'PaymentSucceeded', 'PaymentFailed', 'ProposalMajorityReached', 'ProposalExpired', 'VoteCreated', 'UserCreated', 'DiscussionCreated', 'DiscussionMessageCreated', 'DiscussionSubscriptionCreated', 'DiscussionSubscriptionTypeChanged', 'NotificationTemplateCreated', 'NotificationTemplateUpdated', 'UserNotificationTokenVoided', 'UserNotificationTokenExpired', 'UserNotificationTokenCreated', 'UserNotificationTokenRefreshed', 'ReportCreated', 'ReportRespected', 'ReportDismissed');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
