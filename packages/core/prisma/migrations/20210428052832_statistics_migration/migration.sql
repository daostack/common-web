-- CreateEnum
CREATE TYPE "StatisticType" AS ENUM ('AllTime', 'Hourly', 'Daily', 'Weekly');

-- CreateTable
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "StatisticType" NOT NULL,
    "users" INTEGER NOT NULL,
    "commons" INTEGER NOT NULL,
    "joinProposals" INTEGER NOT NULL,
    "fundingProposasls" INTEGER NOT NULL,
    "discussions" INTEGER NOT NULL,
    "discussionMessages" INTEGER NOT NULL,
    "payments" INTEGER NOT NULL,
    "paymentsAmount" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
