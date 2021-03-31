/*
  Warnings:

  - You are about to drop the column `proccessdError` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "proccessdError",
ADD COLUMN     "processedError" BOOLEAN NOT NULL DEFAULT false;
