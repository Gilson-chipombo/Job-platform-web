-- CreateTable
CREATE TABLE `Vaga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `Location` VARCHAR(191) NOT NULL,
    `minSalary` DOUBLE NOT NULL,
    `maxSalary` DOUBLE NULL,
    `experience` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `Responsability` VARCHAR(191) NULL,
    `requirements` VARCHAR(191) NULL,
    `skills` VARCHAR(191) NULL,
    `beneficios` VARCHAR(191) NULL,
    `idCompany` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vaga` ADD CONSTRAINT `Vaga_idCompany_fkey` FOREIGN KEY (`idCompany`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
