/*
  Warnings:

  - Added the required column `dueDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chargedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('AwaitingInitialPayment', 'Pending', 'Successful', 'Unsuccessful');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Pending', 'Active', 'CanceledByUser', 'CanceledByPaymentFailure');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "paymentStatus" "SubscriptionPaymentStatus" NOT NULL DEFAULT E'AwaitingInitialPayment',
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT E'Pending',
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "chargedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voided" BOOLEAN NOT NULL DEFAULT false;
