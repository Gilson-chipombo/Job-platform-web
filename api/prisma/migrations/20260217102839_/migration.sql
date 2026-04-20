/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telphone` INTEGER NOT NULL,
    `NIF` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `Year` INTEGER NOT NULL,
    `Turno` VARCHAR(191) NOT NULL,
    `AreaInterest` VARCHAR(191) NOT NULL,
    `skills` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Student_email_key`(`email`),
    UNIQUE INDEX `Student_telphone_key`(`telphone`),
    UNIQUE INDEX `Student_NIF_key`(`NIF`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
