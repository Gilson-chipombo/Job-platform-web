-- AlterTable
ALTER TABLE `Company` ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    ADD COLUMN `type` VARCHAR(191) NULL DEFAULT 'Empresa';

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `state` VARCHAR(191) NULL DEFAULT 'Pendente',
    ADD COLUMN `type` VARCHAR(191) NULL DEFAULT 'Estudante';
