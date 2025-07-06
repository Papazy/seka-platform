/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `submission` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hashed_password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_language_id_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_problem_id_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `submission_test_case_results` DROP FOREIGN KEY `submission_test_case_results_submission_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `hashedPassword`,
    ADD COLUMN `hashed_password` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `submission`;

-- CreateTable
CREATE TABLE `submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `problem_id` INTEGER NOT NULL,
    `code_text` TEXT NOT NULL,
    `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING', 'RUNNING') NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `runtime_ms` INTEGER NULL,
    `memory_used_kb` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finished_at` DATETIME(3) NULL,
    `result_json` JSON NULL,
    `language_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_problem_id_fkey` FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission_test_case_results` ADD CONSTRAINT `submission_test_case_results_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
