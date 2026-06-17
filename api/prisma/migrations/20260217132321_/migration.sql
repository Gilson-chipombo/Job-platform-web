/*
  Warnings:

  - You are about to drop the column `pesponsavelName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Company` DROP COLUMN `pesponsavelName`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `responsavelName` VARCHAR(191) NULL;
