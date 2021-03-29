/*
  Warnings:

  - You are about to drop the column `digist` on the `Card` table. All the data in the column will be lost.
  - Added the required column `digits` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "digist",
ADD COLUMN     "digits" TEXT NOT NULL;
