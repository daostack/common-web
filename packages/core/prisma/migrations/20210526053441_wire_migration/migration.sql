/*
  Warnings:

  - You are about to drop the `CardBillingDetail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[circleId]` on the table `Wire` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Payout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `circleId` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citcleFingerpring` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line1` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line2` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingDetailId` to the `Wire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardBillingDetail" DROP CONSTRAINT "CardBillingDetail_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "billingDetailId" TEXT;

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wire" ADD COLUMN     "circleId" TEXT NOT NULL,
ADD COLUMN     "citcleFingerpring" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "line1" TEXT NOT NULL,
ADD COLUMN     "line2" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "billingDetailId" TEXT NOT NULL;

-- DropTable
DROP TABLE "CardBillingDetail";

-- CreateTable
CREATE TABLE "BillingDetail" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "district" TEXT,
    "postalCode" TEXT NOT NULL,
    "userId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wire.circleId_unique" ON "Wire"("circleId");

-- AddForeignKey
ALTER TABLE "BillingDetail" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("billingDetailId") REFERENCES "BillingDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wire" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wire" ADD FOREIGN KEY ("billingDetailId") REFERENCES "BillingDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
