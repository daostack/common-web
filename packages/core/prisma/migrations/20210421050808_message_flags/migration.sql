-- CreateEnum
CREATE TYPE "DiscussionMessageFlag" AS ENUM ('Clear', 'Reported', 'Hidden');

-- AlterTable
ALTER TABLE "DiscussionMessage" ADD COLUMN     "flag" "DiscussionMessageFlag" NOT NULL DEFAULT E'Clear';
