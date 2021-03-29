/*
  Warnings:

  - Added the required column `circleCardId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `digist` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `network` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvvCheck` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avsCheck` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CardNetwork" AS ENUM ('VISA', 'MASTERCARD');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "circleCardId" TEXT NOT NULL,
ADD COLUMN     "digist" TEXT NOT NULL,
ADD COLUMN     "network" "CardNetwork" NOT NULL,
ADD COLUMN     "cvvCheck" TEXT NOT NULL,
ADD COLUMN     "avsCheck" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CardBillingDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardBillingDetails_cardId_unique" ON "CardBillingDetails"("cardId");

-- AddForeignKey
ALTER TABLE "CardBillingDetails" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
