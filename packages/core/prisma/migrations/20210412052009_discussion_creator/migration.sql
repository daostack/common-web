/*
  Warnings:

  - Added the required column `userId` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion"
    ADD COLUMN "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Discussion"
    ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
