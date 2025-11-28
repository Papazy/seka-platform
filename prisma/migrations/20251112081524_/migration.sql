/*
  Warnings:

  - The values [DITOLAK,DITERIMA,DIHAPUS,SUCCESS,ERROR,PENDING] on the enum `hasil_tugas_mahasiswa_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [DITOLAK,DITERIMA,DIHAPUS,SUCCESS,ERROR,PENDING,NOT_STARTED] on the enum `submission_status_jawaban` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `hasil_tugas_mahasiswa` MODIFY `status` ENUM('NOT_STARTED', 'SELESAI', 'TERLAMBAT', 'DISERAHKAN') NOT NULL DEFAULT 'DISERAHKAN';

-- AlterTable
ALTER TABLE `submission` MODIFY `status_jawaban` ENUM('DISERAHKAN', 'TERLAMBAT', 'BELUM_DISERAHKAN') NOT NULL;
