-- DropIndex
DROP INDEX `Message_receiverId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_senderId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `socketId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
