/*
  Warnings:

  - The values [FundingRequestRejected] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('JoinRequestAccepted', 'JoinRequestRejected', 'FundingRequestAccepted', 'FundingRequestRejectedz');
ALTER TABLE "NotificationSystemSettings" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TABLE "NotificationTemplate" ALTER COLUMN "forType" TYPE "NotificationType_new" USING ("forType"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
