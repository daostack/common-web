-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "payoutId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
