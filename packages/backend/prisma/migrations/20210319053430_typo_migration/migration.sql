/*
  Warnings:

  - You are about to drop the column `whitlisted` on the `Common` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Common" DROP COLUMN "whitlisted",
ADD COLUMN     "whitelisted" BOOLEAN NOT NULL DEFAULT false;
