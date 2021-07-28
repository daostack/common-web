-- CreateEnum
CREATE TYPE "UserNotificationTokenState" AS ENUM ('Active', 'Expired', 'Voided');

-- AlterTable
ALTER TABLE "UserNotificationToken" ADD COLUMN     "state" "UserNotificationTokenState" NOT NULL DEFAULT E'Active';
