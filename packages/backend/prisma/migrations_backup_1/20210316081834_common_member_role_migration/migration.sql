-- CreateEnum
CREATE TYPE "CommonMemberRole" AS ENUM ('Founder');

-- AlterTable
ALTER TABLE "CommonMember" ADD COLUMN     "roles" "CommonMemberRole"[];
