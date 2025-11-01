/*
  Warnings:

  - The values [RUNNING,JUDGING,JUDGE_ERROR,PARTIAL,AC,WA,TLE,RE,CE] on the enum `test_case_result_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [RUNNING,JUDGING,JUDGE_ERROR,PARTIAL,AC,WA,TLE,RE,CE] on the enum `test_case_result_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `submission` ADD COLUMN `status_code` ENUM('AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'PENDING') NOT NULL DEFAULT 'PENDING',
    MODIFY `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `test_case_result` MODIFY `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING') NOT NULL;
