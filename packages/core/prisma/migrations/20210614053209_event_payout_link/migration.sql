-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "payoutId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
