/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telphone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[NIF]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AreaInterest` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NIF` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Turno` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telphone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `AreaInterest` VARCHAR(191) NOT NULL,
    ADD COLUMN `NIF` VARCHAR(191) NOT NULL,
    ADD COLUMN `Turno` VARCHAR(191) NOT NULL,
    ADD COLUMN `Year` INTEGER NOT NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `school` VARCHAR(191) NOT NULL,
    ADD COLUMN `skills` VARCHAR(191) NULL,
    ADD COLUMN `telphone` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_telphone_key` ON `User`(`telphone`);

-- CreateIndex
CREATE UNIQUE INDEX `User_NIF_key` ON `User`(`NIF`);
