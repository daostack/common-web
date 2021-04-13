-- CreateEnum
CREATE TYPE "DiscussionType" AS ENUM ('ProposalDiscussion', 'CommonDiscussion');

-- CreateEnum
CREATE TYPE "DiscussionSubscriptionType" AS ENUM ('AllNotifications', 'OnlyMentions', 'NoNotification');

-- CreateEnum
CREATE TYPE "DiscussionMessageType" AS ENUM ('Message');

-- CreateTable
CREATE TABLE "Discussion"
(
    "id"            TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "topic"         TEXT         NOT NULL,
    "description"   TEXT         NOT NULL,
    "latestMessage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionSubscription"
(
    "id"                TEXT                         NOT NULL,
    "createdAt"         TIMESTAMP(3)                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)                 NOT NULL,
    "latestMessageSeen" TIMESTAMP(3)                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type"              "DiscussionSubscriptionType" NOT NULL DEFAULT E'AllNotifications',
    "discussionId"      TEXT                         NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussionMessage"
(
    "id"           TEXT                    NOT NULL,
    "createdAt"    TIMESTAMP(3)            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)            NOT NULL,
    "type"         "DiscussionMessageType" NOT NULL DEFAULT E'Message',
    "message"      TEXT                    NOT NULL,
    "discussionId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscussionSubscription"
    ADD FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionMessage"
    ADD FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
