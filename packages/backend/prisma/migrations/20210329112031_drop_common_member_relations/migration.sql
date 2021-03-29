/*
  Warnings:

  - You are about to drop the column `commonMemberId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `commonMemberId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_commonMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_commonMemberId_fkey";

-- DropIndex
DROP INDEX "Subscription_commonMemberId_unique";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "commonMemberId";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "commonMemberId";
