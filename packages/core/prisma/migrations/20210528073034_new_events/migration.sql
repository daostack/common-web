-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'PayoutCreated';
ALTER TYPE "EventType" ADD VALUE 'PayoutApprovalGiven';
ALTER TYPE "EventType" ADD VALUE 'PayoutRejectionGiven';
ALTER TYPE "EventType" ADD VALUE 'PayoutApproved';
ALTER TYPE "EventType" ADD VALUE 'PayoutRejected';
ALTER TYPE "EventType" ADD VALUE 'PayoutExecuted';
ALTER TYPE "EventType" ADD VALUE 'PayoutCompleted';
