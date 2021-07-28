/*
  Warnings:

  - You are about to drop the column `billingDetailId` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `wireBankDetailId` on the `Wire` table. All the data in the column will be lost.
  - Made the column `userId` on table `BillingDetail` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bankDetailsId` to the `Wire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingDetailsId` to the `Wire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wire" DROP CONSTRAINT "Wire_billingDetailId_fkey";

-- DropForeignKey
ALTER TABLE "Wire" DROP CONSTRAINT "Wire_wireBankDetailId_fkey";

-- AlterTable
ALTER TABLE "BillingDetail" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Wire" DROP COLUMN "billingDetailId",
DROP COLUMN "wireBankDetailId",
ADD COLUMN     "bankDetailsId" TEXT NOT NULL,
ADD COLUMN     "billingDetailsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Wire" ADD FOREIGN KEY ("bankDetailsId") REFERENCES "WireBankDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wire" ADD FOREIGN KEY ("billingDetailsId") REFERENCES "BillingDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
