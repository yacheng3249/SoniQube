/*
  Warnings:

  - You are about to drop the `song` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropTable
DROP TABLE `song`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Song` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `cover` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `audio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RemoveForeignKey
ALTER TABLE `user_songs` DROP FOREIGN KEY `user_songs_userId_fkey`;

-- DropIndex
DROP INDEX `user_songs_userId_fkey` ON `user_songs`;

-- AddForeignKey
ALTER TABLE `user_songs` ADD CONSTRAINT `user_songs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
