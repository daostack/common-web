-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('OneTime', 'Monthly');

-- CreateEnum
CREATE TYPE "CommonMemberRole" AS ENUM ('Founder');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('FundingRequest', 'JoinRequest');

-- CreateEnum
CREATE TYPE "ProposalState" AS ENUM ('Countdown', 'Finalizing', 'Rejected', 'Accepted');

-- CreateEnum
CREATE TYPE "ProposalPaymentState" AS ENUM ('NotAttempted', 'Pending', 'Successful', 'Unsuccessful');

-- CreateEnum
CREATE TYPE "VoteOutcome" AS ENUM ('Approve', 'Condemn');

-- CreateEnum
CREATE TYPE "CardNetwork" AS ENUM ('VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CommonCreated', 'CommonMemberCreated', 'CommonMemberRoleAdded', 'CommonMemberRoleRemoved', 'JoinRequestCreated', 'JoinRequestAccepted', 'JoinRequestRejected', 'FundingRequestCreated', 'FundingRequestAccepted', 'FundingRequestRejected', 'CardCreated', 'CardCvvVerificationPassed', 'CardCvvVerificationFailed', 'VoteCreated', 'UserCreated');

-- CreateTable
CREATE TABLE "User"
(
    "id"            TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "firstName"     TEXT         NOT NULL,
    "lastName"      TEXT         NOT NULL,
    "email"         TEXT         NOT NULL,
    "emailVerified" BOOLEAN      NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Common"
(
    "id"                   TEXT          NOT NULL,
    "createdAt"            TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            TIMESTAMP(3)  NOT NULL,
    "name"                 TEXT          NOT NULL,
    "balance"              INTEGER       NOT NULL DEFAULT 0,
    "raised"               INTEGER       NOT NULL DEFAULT 0,
    "whitelisted"          BOOLEAN       NOT NULL DEFAULT false,
    "fundingType"          "FundingType" NOT NULL,
    "fundingCooldown"      TIMESTAMP(3)  NOT NULL,
    "fundingMinimumAmount" INTEGER       NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonMember"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roles"     "CommonMemberRole"[],
    "commonId"  TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinProposal"
(
    "id"             TEXT                   NOT NULL,
    "createdAt"      TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)           NOT NULL,
    "funding"        INTEGER                NOT NULL,
    "paymentState"   "ProposalPaymentState" NOT NULL DEFAULT E 'NotAttempted',
    "subscriptionId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingProposal"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount"    INTEGER      NOT NULL,
    "funded"    BOOLEAN      NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal"
(
    "id"             TEXT            NOT NULL,
    "createdAt"      TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)    NOT NULL,
    "title"          TEXT,
    "description"    TEXT,
    "link"           JSONB,
    "files"          JSONB,
    "images"         JSONB,
    "type"           "ProposalType"  NOT NULL,
    "state"          "ProposalState" NOT NULL DEFAULT E 'Countdown',
    "votesFor"       INTEGER         NOT NULL DEFAULT 0,
    "votesAgainst"   INTEGER         NOT NULL DEFAULT 0,
    "joinId"         TEXT,
    "fundingId"      TEXT,
    "userId"         TEXT            NOT NULL,
    "commonId"       TEXT            NOT NULL,
    "commonMemberId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription"
(
    "id"             TEXT         NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "cardId"         TEXT         NOT NULL,
    "userId"         TEXT         NOT NULL,
    "commonId"       TEXT         NOT NULL,
    "commonMemberId" TEXT         NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote"
(
    "id"             TEXT          NOT NULL,
    "createdAt"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)  NOT NULL,
    "outcome"        "VoteOutcome" NOT NULL,
    "commonMemberId" TEXT          NOT NULL,
    "proposalId"     TEXT          NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment"
(
    "id"             TEXT         NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT,
    "proposalId"     TEXT         NOT NULL,
    "userId"         TEXT         NOT NULL,
    "commonId"       TEXT         NOT NULL,
    "commonMemberId" TEXT         NOT NULL,
    "cardId"         TEXT         NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card"
(
    "id"           TEXT          NOT NULL,
    "circleCardId" TEXT          NOT NULL,
    "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)  NOT NULL,
    "digits"       TEXT          NOT NULL,
    "network"      "CardNetwork" NOT NULL,
    "cvvCheck"     TEXT          NOT NULL,
    "avsCheck"     TEXT          NOT NULL,
    "userId"       TEXT          NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBillingDetails"
(
    "id"         TEXT         NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "name"       TEXT         NOT NULL,
    "line1"      TEXT         NOT NULL,
    "line2"      TEXT,
    "city"       TEXT         NOT NULL,
    "country"    TEXT         NOT NULL,
    "district"   TEXT,
    "postalCode" TEXT         NOT NULL,
    "cardId"     TEXT         NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type"      "EventType"  NOT NULL,
    "payload"   JSONB,
    "commonId"  TEXT,
    "userId"    TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE
UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE
UNIQUE INDEX "CommonMember.userId_commonId_unique" ON "CommonMember"("userId", "commonId");

-- CreateIndex
CREATE
UNIQUE INDEX "Proposal.joinId_unique" ON "Proposal"("joinId");

-- CreateIndex
CREATE
UNIQUE INDEX "Proposal.fundingId_unique" ON "Proposal"("fundingId");

-- CreateIndex
CREATE
UNIQUE INDEX "Subscription_commonMemberId_unique" ON "Subscription"("commonMemberId");

-- CreateIndex
CREATE
UNIQUE INDEX "Vote.commonMemberId_proposalId_unique" ON "Vote"("commonMemberId", "proposalId");

-- CreateIndex
CREATE
UNIQUE INDEX "Payment_proposalId_unique" ON "Payment"("proposalId");

-- CreateIndex
CREATE
UNIQUE INDEX "CardBillingDetails_cardId_unique" ON "CardBillingDetails"("cardId");

-- AddForeignKey
ALTER TABLE "CommonMember"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonMember"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinProposal"
    ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("joinId") REFERENCES "JoinProposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("fundingId") REFERENCES "FundingProposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal"
    ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription"
    ADD FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription"
    ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote"
    ADD FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote"
    ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("commonMemberId") REFERENCES "CommonMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("proposalId") REFERENCES "JoinProposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment"
    ADD FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBillingDetails"
    ADD FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event"
    ADD FOREIGN KEY ("commonId") REFERENCES "Common" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
