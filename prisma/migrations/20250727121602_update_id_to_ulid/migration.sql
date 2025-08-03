/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `asisten_praktikum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bahasa_pemrograman` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contoh_test_case` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dosen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dosen_praktikum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `fakultas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `laboran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mahasiswa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `nilai_tugas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pengaturan_sistem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `peserta_praktikum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `praktikum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `program_studi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `soal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `test_case` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `test_case_result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tugas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tugas_bahasa` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `asisten_praktikum` DROP FOREIGN KEY `asisten_praktikum_id_mahasiswa_fkey`;

-- DropForeignKey
ALTER TABLE `asisten_praktikum` DROP FOREIGN KEY `asisten_praktikum_id_praktikum_fkey`;

-- DropForeignKey
ALTER TABLE `contoh_test_case` DROP FOREIGN KEY `contoh_test_case_id_soal_fkey`;

-- DropForeignKey
ALTER TABLE `dosen` DROP FOREIGN KEY `dosen_program_studi_id_fkey`;

-- DropForeignKey
ALTER TABLE `dosen_praktikum` DROP FOREIGN KEY `dosen_praktikum_id_dosen_fkey`;

-- DropForeignKey
ALTER TABLE `dosen_praktikum` DROP FOREIGN KEY `dosen_praktikum_id_praktikum_fkey`;

-- DropForeignKey
ALTER TABLE `laboran` DROP FOREIGN KEY `laboran_id_admin_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `mahasiswa_program_studi_id_fkey`;

-- DropForeignKey
ALTER TABLE `nilai_tugas` DROP FOREIGN KEY `nilai_tugas_id_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `nilai_tugas` DROP FOREIGN KEY `nilai_tugas_id_tugas_fkey`;

-- DropForeignKey
ALTER TABLE `peserta_praktikum` DROP FOREIGN KEY `peserta_praktikum_id_mahasiswa_fkey`;

-- DropForeignKey
ALTER TABLE `peserta_praktikum` DROP FOREIGN KEY `peserta_praktikum_id_praktikum_fkey`;

-- DropForeignKey
ALTER TABLE `praktikum` DROP FOREIGN KEY `praktikum_id_laboran_fkey`;

-- DropForeignKey
ALTER TABLE `program_studi` DROP FOREIGN KEY `program_studi_id_fakultas_fkey`;

-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `soal_id_tugas_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_id_bahasa_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_id_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `submission_id_soal_fkey`;

-- DropForeignKey
ALTER TABLE `test_case` DROP FOREIGN KEY `test_case_id_soal_fkey`;

-- DropForeignKey
ALTER TABLE `test_case_result` DROP FOREIGN KEY `test_case_result_id_submission_fkey`;

-- DropForeignKey
ALTER TABLE `test_case_result` DROP FOREIGN KEY `test_case_result_id_test_case_fkey`;

-- DropForeignKey
ALTER TABLE `tugas` DROP FOREIGN KEY `tugas_id_asisten_fkey`;

-- DropForeignKey
ALTER TABLE `tugas` DROP FOREIGN KEY `tugas_id_praktikum_fkey`;

-- DropForeignKey
ALTER TABLE `tugas_bahasa` DROP FOREIGN KEY `tugas_bahasa_id_bahasa_fkey`;

-- DropForeignKey
ALTER TABLE `tugas_bahasa` DROP FOREIGN KEY `tugas_bahasa_id_tugas_fkey`;

-- DropIndex
DROP INDEX `asisten_praktikum_id_praktikum_fkey` ON `asisten_praktikum`;

-- DropIndex
DROP INDEX `contoh_test_case_id_soal_fkey` ON `contoh_test_case`;

-- DropIndex
DROP INDEX `dosen_program_studi_id_fkey` ON `dosen`;

-- DropIndex
DROP INDEX `dosen_praktikum_id_praktikum_fkey` ON `dosen_praktikum`;

-- DropIndex
DROP INDEX `laboran_id_admin_fkey` ON `laboran`;

-- DropIndex
DROP INDEX `mahasiswa_program_studi_id_fkey` ON `mahasiswa`;

-- DropIndex
DROP INDEX `nilai_tugas_id_tugas_fkey` ON `nilai_tugas`;

-- DropIndex
DROP INDEX `peserta_praktikum_id_praktikum_fkey` ON `peserta_praktikum`;

-- DropIndex
DROP INDEX `praktikum_id_laboran_fkey` ON `praktikum`;

-- DropIndex
DROP INDEX `program_studi_id_fakultas_fkey` ON `program_studi`;

-- DropIndex
DROP INDEX `soal_id_tugas_fkey` ON `soal`;

-- DropIndex
DROP INDEX `submission_id_bahasa_fkey` ON `submission`;

-- DropIndex
DROP INDEX `submission_id_peserta_fkey` ON `submission`;

-- DropIndex
DROP INDEX `submission_id_soal_fkey` ON `submission`;

-- DropIndex
DROP INDEX `test_case_id_soal_fkey` ON `test_case`;

-- DropIndex
DROP INDEX `test_case_result_id_test_case_fkey` ON `test_case_result`;

-- DropIndex
DROP INDEX `tugas_id_asisten_fkey` ON `tugas`;

-- DropIndex
DROP INDEX `tugas_id_praktikum_fkey` ON `tugas`;

-- DropIndex
DROP INDEX `tugas_bahasa_id_bahasa_fkey` ON `tugas_bahasa`;

-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `asisten_praktikum` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_mahasiswa` VARCHAR(191) NOT NULL,
    MODIFY `id_praktikum` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `bahasa_pemrograman` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `contoh_test_case` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_soal` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `dosen` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `program_studi_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `dosen_praktikum` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_dosen` VARCHAR(191) NOT NULL,
    MODIFY `id_praktikum` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `fakultas` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `laboran` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_admin` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `mahasiswa` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `program_studi_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `nilai_tugas` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_peserta` VARCHAR(191) NOT NULL,
    MODIFY `id_tugas` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pengaturan_sistem` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `peserta_praktikum` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_mahasiswa` VARCHAR(191) NOT NULL,
    MODIFY `id_praktikum` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `praktikum` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_laboran` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `program_studi` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_fakultas` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `soal` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_tugas` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `submission` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_soal` VARCHAR(191) NOT NULL,
    MODIFY `id_peserta` VARCHAR(191) NOT NULL,
    MODIFY `id_bahasa` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `test_case` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_soal` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `test_case_result` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_submission` VARCHAR(191) NOT NULL,
    MODIFY `id_test_case` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tugas` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `id_praktikum` VARCHAR(191) NOT NULL,
    MODIFY `id_asisten` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tugas_bahasa` DROP PRIMARY KEY,
    MODIFY `id_tugas` VARCHAR(191) NOT NULL,
    MODIFY `id_bahasa` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_tugas`, `id_bahasa`);

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
ALTER TABLE `tugas_bahasa` ADD CONSTRAINT `tugas_bahasa_id_tugas_fkey` FOREIGN KEY (`id_tugas`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tugas_bahasa` ADD CONSTRAINT `tugas_bahasa_id_bahasa_fkey` FOREIGN KEY (`id_bahasa`) REFERENCES `bahasa_pemrograman`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
