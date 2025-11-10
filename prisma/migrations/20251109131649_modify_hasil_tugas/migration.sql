/*
  Warnings:

  - You are about to drop the `nilai_tugas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `nilai_tugas` DROP FOREIGN KEY `nilai_tugas_id_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `nilai_tugas` DROP FOREIGN KEY `nilai_tugas_id_tugas_fkey`;

-- DropTable
DROP TABLE `nilai_tugas`;

-- CreateTable
CREATE TABLE `hasil_tugas_mahasiswa` (
    `id` VARCHAR(191) NOT NULL,
    `id_peserta` VARCHAR(191) NOT NULL,
    `id_tugas` VARCHAR(191) NOT NULL,
    `total_submission` INTEGER NOT NULL,
    `total_soal_selesai` INTEGER NOT NULL,
    `total_nilai` INTEGER NOT NULL,
    `status` ENUM('DISERAHKAN', 'TERLAMBAT', 'DITOLAK', 'DITERIMA', 'DIHAPUS', 'SUCCESS', 'ERROR', 'PENDING') NOT NULL DEFAULT 'DISERAHKAN',
    `is_late` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `hasil_tugas_mahasiswa_id_peserta_id_tugas_idx`(`id_peserta`, `id_tugas`),
    UNIQUE INDEX `hasil_tugas_mahasiswa_id_peserta_id_tugas_key`(`id_peserta`, `id_tugas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hasil_tugas_mahasiswa` ADD CONSTRAINT `hasil_tugas_mahasiswa_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta_praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil_tugas_mahasiswa` ADD CONSTRAINT `hasil_tugas_mahasiswa_id_tugas_fkey` FOREIGN KEY (`id_tugas`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
