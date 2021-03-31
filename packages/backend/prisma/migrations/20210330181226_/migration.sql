-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proccessdError" BOOLEAN NOT NULL DEFAULT false;
