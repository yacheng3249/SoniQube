-- AlterTable
ALTER TABLE `song` ALTER COLUMN `active` DROP DEFAULT;

-- CreateTable
CREATE TABLE `user_songs` (
    `id` VARCHAR(191) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `cover` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `audio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_songs` ADD CONSTRAINT `user_songs_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
