-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laboran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_admin` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `laboran_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `program_studi_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_nip_key`(`nip`),
    UNIQUE INDEX `dosen_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `npm` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `program_studi_id` INTEGER NOT NULL,

    UNIQUE INDEX `mahasiswa_npm_key`(`npm`),
    UNIQUE INDEX `mahasiswa_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `praktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_laboran` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kode_praktikum` VARCHAR(191) NOT NULL,
    `kode_mk` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `semester` ENUM('GANJIL', 'GENAP') NOT NULL,
    `tahun` INTEGER NOT NULL,
    `jadwal_hari` VARCHAR(191) NOT NULL,
    `jadwal_jam_masuk` DATETIME(3) NOT NULL,
    `jadwal_jam_selesai` DATETIME(3) NOT NULL,
    `ruang` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `praktikum_kode_praktikum_key`(`kode_praktikum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen_praktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dosen` INTEGER NOT NULL,
    `id_praktikum` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `dosen_praktikum_id_dosen_id_praktikum_key`(`id_dosen`, `id_praktikum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asisten_praktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NOT NULL,
    `id_praktikum` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `asisten_praktikum_id_mahasiswa_id_praktikum_key`(`id_mahasiswa`, `id_praktikum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peserta_praktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mahasiswa` INTEGER NOT NULL,
    `id_praktikum` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `peserta_praktikum_id_mahasiswa_id_praktikum_key`(`id_mahasiswa`, `id_praktikum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_praktikum` INTEGER NOT NULL,
    `id_asisten` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `maksimal_submit` INTEGER NOT NULL DEFAULT 3,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `soal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tugas` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `batasan` LONGTEXT NOT NULL,
    `format_input` LONGTEXT NOT NULL,
    `format_output` LONGTEXT NOT NULL,
    `batasan_memori_kb` INTEGER NOT NULL,
    `batasan_waktu_eksekusi_ms` INTEGER NOT NULL,
    `template_kode` TEXT NOT NULL,
    `bobot_nilai` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contoh_test_case` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_soal` INTEGER NOT NULL,
    `contoh_input` TEXT NOT NULL,
    `contoh_output` TEXT NOT NULL,
    `penjelasan_input` TEXT NOT NULL,
    `penjelasan_output` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_case` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_soal` INTEGER NOT NULL,
    `input` TEXT NOT NULL,
    `output_diharapkan` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bahasa_pemrograman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `ekstensi` VARCHAR(191) NOT NULL,
    `compiler` VARCHAR(191) NOT NULL,
    `versi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bahasa_pemrograman_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_soal` INTEGER NOT NULL,
    `id_peserta` INTEGER NOT NULL,
    `id_bahasa` INTEGER NOT NULL,
    `source_code` TEXT NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `status_jawaban` ENUM('DISERAHKAN', 'TERLAMBAT', 'DITOLAK', 'DITERIMA', 'DIHAPUS', 'PENDING') NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_case_result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_submission` INTEGER NOT NULL,
    `id_test_case` INTEGER NOT NULL,
    `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'PENDING', 'RUNNING', 'JUDGING', 'JUDGE_ERROR', 'PARTIAL') NOT NULL,
    `output_dihasilkan` TEXT NULL,
    `waktu_eksekusi_ms` INTEGER NULL,
    `memori_kb` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `test_case_result_id_submission_id_test_case_key`(`id_submission`, `id_test_case`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_tugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_peserta` INTEGER NOT NULL,
    `id_tugas` INTEGER NOT NULL,
    `total_nilai` INTEGER NOT NULL,
    `status` ENUM('DISERAHKAN', 'TERLAMBAT', 'DITOLAK', 'DITERIMA', 'DIHAPUS', 'PENDING') NOT NULL DEFAULT 'DISERAHKAN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nilai_tugas_id_peserta_id_tugas_key`(`id_peserta`, `id_tugas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengaturan_sistem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `current_semester` ENUM('GANJIL', 'GENAP') NOT NULL,
    `current_year` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fakultas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kode_fakultas` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fakultas_nama_key`(`nama`),
    UNIQUE INDEX `fakultas_kode_fakultas_key`(`kode_fakultas`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_studi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kode_prodi` VARCHAR(191) NOT NULL,
    `id_fakultas` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `program_studi_kode_prodi_key`(`kode_prodi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `laboran` ADD CONSTRAINT `laboran_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_program_studi_id_fkey` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_program_studi_id_fkey` FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `praktikum` ADD CONSTRAINT `praktikum_id_laboran_fkey` FOREIGN KEY (`id_laboran`) REFERENCES `laboran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen_praktikum` ADD CONSTRAINT `dosen_praktikum_id_dosen_fkey` FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen_praktikum` ADD CONSTRAINT `dosen_praktikum_id_praktikum_fkey` FOREIGN KEY (`id_praktikum`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asisten_praktikum` ADD CONSTRAINT `asisten_praktikum_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asisten_praktikum` ADD CONSTRAINT `asisten_praktikum_id_praktikum_fkey` FOREIGN KEY (`id_praktikum`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta_praktikum` ADD CONSTRAINT `peserta_praktikum_id_mahasiswa_fkey` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta_praktikum` ADD CONSTRAINT `peserta_praktikum_id_praktikum_fkey` FOREIGN KEY (`id_praktikum`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tugas` ADD CONSTRAINT `tugas_id_praktikum_fkey` FOREIGN KEY (`id_praktikum`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tugas` ADD CONSTRAINT `tugas_id_asisten_fkey` FOREIGN KEY (`id_asisten`) REFERENCES `asisten_praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `soal_id_tugas_fkey` FOREIGN KEY (`id_tugas`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contoh_test_case` ADD CONSTRAINT `contoh_test_case_id_soal_fkey` FOREIGN KEY (`id_soal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_case` ADD CONSTRAINT `test_case_id_soal_fkey` FOREIGN KEY (`id_soal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission` ADD CONSTRAINT `submission_id_soal_fkey` FOREIGN KEY (`id_soal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission` ADD CONSTRAINT `submission_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta_praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission` ADD CONSTRAINT `submission_id_bahasa_fkey` FOREIGN KEY (`id_bahasa`) REFERENCES `bahasa_pemrograman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_case_result` ADD CONSTRAINT `test_case_result_id_submission_fkey` FOREIGN KEY (`id_submission`) REFERENCES `submission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_case_result` ADD CONSTRAINT `test_case_result_id_test_case_fkey` FOREIGN KEY (`id_test_case`) REFERENCES `test_case`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_tugas` ADD CONSTRAINT `nilai_tugas_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta_praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_tugas` ADD CONSTRAINT `nilai_tugas_id_tugas_fkey` FOREIGN KEY (`id_tugas`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_studi` ADD CONSTRAINT `program_studi_id_fakultas_fkey` FOREIGN KEY (`id_fakultas`) REFERENCES `fakultas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
