-- DropIndex
DROP INDEX "NotificationSystemSettings.type_unique";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "status" "NotificationProcessStatus" NOT NULL DEFAULT E'NotProcessed';

-- AlterTable
ALTER TABLE "NotificationSystemSettings" ADD COLUMN     "showInUserFeed" BOOLEAN NOT NULL DEFAULT false;
