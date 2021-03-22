-- AlterTable
ALTER TABLE "CardBillingDetails" ADD COLUMN     "district" TEXT,
ALTER COLUMN "line2" DROP NOT NULL;
