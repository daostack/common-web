/*
  Warnings:

  - You are about to drop the column `circleFingerpring` on the `Wire` table. All the data in the column will be lost.
  - Added the required column `circleFingerprint` to the `Wire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wire"
    DROP COLUMN "circleFingerpring",
    ADD COLUMN "circleFingerprint" TEXT NOT NULL;
