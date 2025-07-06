/*
  Warnings:

  - You are about to drop the column `memoryUsedKb` on the `submission_test_case_results` table. All the data in the column will be lost.
  - You are about to drop the column `runtimeMs` on the `submission_test_case_results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `submission_test_case_results` DROP COLUMN `memoryUsedKb`,
    DROP COLUMN `runtimeMs`,
    ADD COLUMN `actual_output` TEXT NULL,
    ADD COLUMN `memory_used_kb` INTEGER NULL,
    ADD COLUMN `runtime_ms` INTEGER NULL,
    MODIFY `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING', 'RUNNING', 'JUDGING', 'JUDGE_ERROR', 'PARTIAL') NOT NULL;

-- AlterTable
ALTER TABLE `submissions` ADD COLUMN `error_message` TEXT NULL,
    ADD COLUMN `judge_started_at` DATETIME(3) NULL,
    ADD COLUMN `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING', 'RUNNING', 'JUDGING', 'JUDGE_ERROR', 'PARTIAL') NOT NULL;
