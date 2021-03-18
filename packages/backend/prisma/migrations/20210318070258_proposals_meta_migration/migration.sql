/*
  Warnings:

  - Changed the type of `fundingType` on the `Common` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `funding` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundingType` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentState` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadataId` to the `JoinProposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('OneTime', 'Monthly');

-- CreateEnum
CREATE TYPE "ProposalState" AS ENUM ('Countdown', 'Rejected', 'Accepted');

-- CreateEnum
CREATE TYPE "ProposalPaymentState" AS ENUM ('NotAttempted', 'Pending', 'Successful', 'Unsuccessful');

-- AlterTable
ALTER TABLE "Common" DROP COLUMN "fundingType",
ADD COLUMN     "fundingType" "FundingType" NOT NULL;

-- AlterTable
ALTER TABLE "JoinProposal" ADD COLUMN     "funding" INTEGER NOT NULL,
ADD COLUMN     "fundingType" "FundingType" NOT NULL,
ADD COLUMN     "state" "ProposalState" NOT NULL,
ADD COLUMN     "paymentState" "ProposalState" NOT NULL,
ADD COLUMN     "metadataId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CommonFundingType";

-- CreateTable
CREATE TABLE "ProposalDescription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "link" JSONB,
    "files" JSONB,
    "images" JSONB,
    "joinId" TEXT,
    "fundingId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProposalDescription_joinId_unique" ON "ProposalDescription"("joinId");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalDescription_fundingId_unique" ON "ProposalDescription"("fundingId");

-- AddForeignKey
ALTER TABLE "ProposalDescription" ADD FOREIGN KEY ("joinId") REFERENCES "JoinProposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalDescription" ADD FOREIGN KEY ("fundingId") REFERENCES "FundingProposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
