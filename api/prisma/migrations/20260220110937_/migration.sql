/*
  Warnings:

  - You are about to drop the column `AreaInterest` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `NIF` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Turno` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Year` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `Location` on the `Vaga` table. All the data in the column will be lost.
  - You are about to drop the column `Responsability` on the `Vaga` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nif]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `areaInterest` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nif` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Vaga` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Student_NIF_key` ON `Student`;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `AreaInterest`,
    DROP COLUMN `NIF`,
    DROP COLUMN `Turno`,
    DROP COLUMN `Year`,
    ADD COLUMN `areaInterest` VARCHAR(191) NOT NULL,
    ADD COLUMN `nif` VARCHAR(191) NOT NULL,
    ADD COLUMN `turno` VARCHAR(191) NOT NULL,
    ADD COLUMN `year` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vaga` DROP COLUMN `Location`,
    DROP COLUMN `Responsability`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `responsability` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Apply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idStudent` INTEGER NOT NULL,
    `idVaga` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pendente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Apply_idStudent_idVaga_key`(`idStudent`, `idVaga`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Student_nif_key` ON `Student`(`nif`);

-- AddForeignKey
ALTER TABLE `Apply` ADD CONSTRAINT `Apply_idStudent_fkey` FOREIGN KEY (`idStudent`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Apply` ADD CONSTRAINT `Apply_idVaga_fkey` FOREIGN KEY (`idVaga`) REFERENCES `Vaga`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
