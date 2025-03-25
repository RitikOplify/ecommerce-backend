-- AlterTable
ALTER TABLE `user` MODIFY `isAdmin` ENUM('user', 'admin') NOT NULL DEFAULT 'user';
