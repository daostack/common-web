-- CreateEnum
CREATE TYPE "CommonFundingType" AS ENUM ('OneTime', 'Monthly');

-- CreateTable
CREATE TABLE "Common" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "raised" INTEGER NOT NULL DEFAULT 0,
    "whitlisted" BOOLEAN NOT NULL DEFAULT false,
    "fundingType" "CommonFundingType" NOT NULL,
    "fundingCooldown" TIMESTAMP(3) NOT NULL,
    "fundingMinimumAmount" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonMember" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommonMember" ADD FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonMember" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
