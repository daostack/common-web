/*
  Warnings:

  - You are about to drop the column `description` on the `WireBankDetail` table. All the data in the column will be lost.
  - Added the required column `description` to the `Wire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wire"
    ADD COLUMN "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WireBankDetail"
    DROP COLUMN "description",
    ALTER COLUMN "line1" DROP NOT NULL,
    ALTER COLUMN "line2" DROP NOT NULL;
