/*
  Warnings:

  - Added the required column `total_soal` to the `hasil_tugas_mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hasil_tugas_mahasiswa` ADD COLUMN `total_soal` INTEGER NOT NULL;
