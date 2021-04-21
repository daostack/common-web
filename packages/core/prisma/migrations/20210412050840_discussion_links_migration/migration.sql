/*
  Warnings:

  - You are about to drop the column `latestMessageSeen` on the `DiscussionSubscription` table. All the data in the column will be lost.
  - Added the required column `userId` to the `DiscussionMessage` table without a default value. This is not possible if the table is not empty.
  - Made the column `discussionId` on table `DiscussionMessage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `DiscussionSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscussionMessage"
    ADD COLUMN "userId" TEXT NOT NULL,
    ALTER COLUMN "discussionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "DiscussionSubscription"
    DROP COLUMN "latestMessageSeen",
    ADD COLUMN "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscussionMessage"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionSubscription"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
