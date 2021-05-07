/*
  Warnings:

  - You are about to drop the column `link` on the `Proposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "link",
ADD COLUMN     "links" JSONB;
