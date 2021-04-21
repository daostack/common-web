/*
  Warnings:

  - The values [AwaitingReview,ModeratorActionTaken,AdminActionTaken,Dissmissed] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReportAction" AS ENUM ('Respected', 'Dismissed');

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('Active', 'Clossed');
ALTER TABLE "Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "action" "ReportAction",
ALTER COLUMN "status" SET DEFAULT E'Active';
