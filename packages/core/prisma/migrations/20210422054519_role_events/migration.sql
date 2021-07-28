-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'RoleCreated';
ALTER TYPE "EventType" ADD VALUE 'RolePermissionAdded';
ALTER TYPE "EventType" ADD VALUE 'RolePermissionRemoved';
ALTER TYPE "EventType" ADD VALUE 'RoleDeleted';
ALTER TYPE "EventType" ADD VALUE 'UserAddedToRole';
ALTER TYPE "EventType" ADD VALUE 'UserRemovedFromRole';
