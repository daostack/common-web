/*
  Warnings:

  - Added the required column `commonId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "commonId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE CASCADE ON UPDATE CASCADE;
