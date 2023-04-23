/*
  Warnings:

  - You are about to drop the column `UserId` on the `user_songs` table. All the data in the column will be lost.
  - Added the required column `userId` to the `user_songs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_songs` DROP FOREIGN KEY `user_songs_UserId_fkey`;

-- AlterTable
ALTER TABLE `user_songs` DROP COLUMN `UserId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `user_songs` ADD CONSTRAINT `user_songs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
