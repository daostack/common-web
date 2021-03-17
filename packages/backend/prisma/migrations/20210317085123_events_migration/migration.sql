-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CommonCreated', 'CommonMemberCreated', 'CommonMemberRoleAdded', 'CommonMemberRoleRemoved', 'UserCreated');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "EventType" NOT NULL,
    "payload" JSONB,
    "commonId" TEXT,
    "userId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
