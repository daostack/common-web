-- CreateTable
CREATE TABLE "_PayoutToUser"
(
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PayoutToUser_AB_unique" ON "_PayoutToUser" ("A", "B");

-- CreateIndex
CREATE INDEX "_PayoutToUser_B_index" ON "_PayoutToUser" ("B");

-- AddForeignKey
ALTER TABLE "_PayoutToUser"
    ADD FOREIGN KEY ("A") REFERENCES "Payout" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PayoutToUser"
    ADD FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
