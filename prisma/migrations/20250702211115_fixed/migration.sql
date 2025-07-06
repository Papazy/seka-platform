/*
  Warnings:

  - The primary key for the `class_memberships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleInClass` on the `class_memberships` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `class_memberships` table. All the data in the column will be lost.
  - Added the required column `role_in_class` to the `class_memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `class_memberships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `class_memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `class_memberships` DROP FOREIGN KEY `class_memberships_userId_fkey`;

-- AlterTable
ALTER TABLE `class_memberships` DROP PRIMARY KEY,
    DROP COLUMN `roleInClass`,
    DROP COLUMN `userId`,
    ADD COLUMN `role_in_class` ENUM('STUDENT', 'DOSEN', 'ADMIN', 'ASSISTANT') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `class_id`);

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('STUDENT', 'DOSEN', 'ADMIN', 'ASSISTANT') NOT NULL;

-- AddForeignKey
ALTER TABLE `class_memberships` ADD CONSTRAINT `class_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
