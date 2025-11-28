/*
  Warnings:

  - The values [ACCEPTED,WRONG_ANSWER,TIME_LIMIT_EXCEEDED,RUNTIME_ERROR,COMPILATION_ERROR] on the enum `test_case_result_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `test_case_result` MODIFY `status` ENUM('AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'PENDING') NOT NULL;
