/*
  Warnings:

  - Added the required column `type` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "type" "DiscussionType" NOT NULL;
