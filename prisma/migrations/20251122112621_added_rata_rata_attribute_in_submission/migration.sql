/*
  Warnings:

  - Made the column `waktu_eksekusi_ms` on table `test_case_result` required. This step will fail if there are existing NULL values in that column.
  - Made the column `memori_kb` on table `test_case_result` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `submission` ADD COLUMN `memori_rata_rata_kb` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `waktu_rata_rata_eksekusi_ms` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `test_case_result` MODIFY `waktu_eksekusi_ms` INTEGER NOT NULL,
    MODIFY `memori_kb` INTEGER NOT NULL;
