/*
  Warnings:

  - You are about to drop the column `bankName` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `line1` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `line2` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Wire` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Wire` table. All the data in the column will be lost.
  - Added the required column `wireBankDetailId` to the `Wire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wire"
    DROP COLUMN "bankName",
    DROP COLUMN "description",
    DROP COLUMN "line1",
    DROP COLUMN "line2",
    DROP COLUMN "city",
    DROP COLUMN "country",
    DROP COLUMN "district",
    DROP COLUMN "postalCode",
    ADD COLUMN "wireBankDetailId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WireBankDetail"
(
    "id"          TEXT         NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "bankName"    TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "line1"       TEXT         NOT NULL,
    "line2"       TEXT         NOT NULL,
    "city"        TEXT         NOT NULL,
    "country"     TEXT         NOT NULL,
    "district"    TEXT,
    "postalCode"  TEXT         NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wire"
    ADD FOREIGN KEY ("wireBankDetailId") REFERENCES "WireBankDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
