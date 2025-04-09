-- AlterTable
ALTER TABLE `company` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `dealer` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'dealer';

-- AlterTable
ALTER TABLE `executive` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'executive';
