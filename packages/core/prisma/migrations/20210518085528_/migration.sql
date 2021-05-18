/*
  Warnings:

  - Made the column `joinId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commonId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "joinId" SET NOT NULL,
ALTER COLUMN "commonId" SET NOT NULL;
