/*
  Warnings:

  - You are about to drop the column `about` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryLevel2Id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `warranty` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `mainCategoryId` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keyfeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maincategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subcategorylevel2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `business` DROP FOREIGN KEY `Business_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `business` DROP FOREIGN KEY `Business_userId_fkey`;

-- DropForeignKey
ALTER TABLE `keyfeature` DROP FOREIGN KEY `KeyFeature_productId_fkey`;

-- DropForeignKey
ALTER TABLE `offer` DROP FOREIGN KEY `Offer_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_subCategoryLevel2Id_fkey`;

-- DropForeignKey
ALTER TABLE `specification` DROP FOREIGN KEY `Specification_productId_fkey`;

-- DropForeignKey
ALTER TABLE `subcategory` DROP FOREIGN KEY `SubCategory_mainCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `subcategorylevel2` DROP FOREIGN KEY `SubCategoryLevel2_subCategoryId_fkey`;

-- DropIndex
DROP INDEX `Product_subCategoryLevel2Id_fkey` ON `product`;

-- DropIndex
DROP INDEX `SubCategory_mainCategoryId_fkey` ON `subcategory`;

-- DropIndex
DROP INDEX `SubCategory_name_key` ON `subcategory`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `about`,
    DROP COLUMN `details`,
    DROP COLUMN `price`,
    DROP COLUMN `rating`,
    DROP COLUMN `subCategoryLevel2Id`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `warranty`,
    ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `subcategoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `subcategory` DROP COLUMN `mainCategoryId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `address`;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `business`;

-- DropTable
DROP TABLE `keyfeature`;

-- DropTable
DROP TABLE `maincategory`;

-- DropTable
DROP TABLE `offer`;

-- DropTable
DROP TABLE `specification`;

-- DropTable
DROP TABLE `subcategorylevel2`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Category_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Executive` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Executive_email_key`(`email`),
    INDEX `Executive_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dealer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gstNo` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Dealer_gstNo_key`(`gstNo`),
    INDEX `Dealer_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'CLOSED') NOT NULL,
    `stage` ENUM('INQUIRY', 'NEGOTIATION', 'FINALIZED') NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `comments` VARCHAR(191) NULL,
    `executiveId` VARCHAR(191) NULL,
    `dealerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Lead_email_key`(`email`),
    INDEX `Lead_companyId_idx`(`companyId`),
    INDEX `Lead_productId_idx`(`productId`),
    INDEX `Lead_executiveId_idx`(`executiveId`),
    INDEX `Lead_dealerId_idx`(`dealerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FollowUp` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `stage` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FollowUp_leadId_idx`(`leadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Product_companyId_idx` ON `Product`(`companyId`);

-- CreateIndex
CREATE INDEX `Product_categoryId_idx` ON `Product`(`categoryId`);

-- CreateIndex
CREATE INDEX `Product_subcategoryId_idx` ON `Product`(`subcategoryId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subcategory` ADD CONSTRAINT `Subcategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Executive` ADD CONSTRAINT `Executive_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dealer` ADD CONSTRAINT `Dealer_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_executiveId_fkey` FOREIGN KEY (`executiveId`) REFERENCES `Executive`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `Dealer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
