-- CreateIndex
CREATE INDEX `asisten_praktikum_id_mahasiswa_id_praktikum_idx` ON `asisten_praktikum`(`id_mahasiswa`, `id_praktikum`);

-- CreateIndex
CREATE INDEX `dosen_praktikum_id_dosen_id_praktikum_idx` ON `dosen_praktikum`(`id_dosen`, `id_praktikum`);

-- CreateIndex
CREATE INDEX `nilai_tugas_id_peserta_id_tugas_idx` ON `nilai_tugas`(`id_peserta`, `id_tugas`);

-- CreateIndex
CREATE INDEX `peserta_praktikum_id_mahasiswa_id_praktikum_idx` ON `peserta_praktikum`(`id_mahasiswa`, `id_praktikum`);

-- CreateIndex
CREATE INDEX `submission_id_soal_id_peserta_id_bahasa_idx` ON `submission`(`id_soal`, `id_peserta`, `id_bahasa`);

-- CreateIndex
CREATE INDEX `test_case_result_id_submission_id_test_case_idx` ON `test_case_result`(`id_submission`, `id_test_case`);

-- CreateIndex
CREATE INDEX `tugas_id_praktikum_id_asisten_idx` ON `tugas`(`id_praktikum`, `id_asisten`);

-- RenameIndex
ALTER TABLE `contoh_test_case` RENAME INDEX `contoh_test_case_id_soal_fkey` TO `contoh_test_case_id_soal_idx`;

-- RenameIndex
ALTER TABLE `dosen` RENAME INDEX `dosen_program_studi_id_fkey` TO `dosen_program_studi_id_idx`;

-- RenameIndex
ALTER TABLE `laboran` RENAME INDEX `laboran_id_admin_fkey` TO `laboran_id_admin_idx`;

-- RenameIndex
ALTER TABLE `mahasiswa` RENAME INDEX `mahasiswa_program_studi_id_fkey` TO `mahasiswa_program_studi_id_idx`;

-- RenameIndex
ALTER TABLE `praktikum` RENAME INDEX `praktikum_id_laboran_fkey` TO `praktikum_id_laboran_idx`;

-- RenameIndex
ALTER TABLE `program_studi` RENAME INDEX `program_studi_id_fakultas_fkey` TO `program_studi_id_fakultas_idx`;

-- RenameIndex
ALTER TABLE `soal` RENAME INDEX `soal_id_tugas_fkey` TO `soal_id_tugas_idx`;

-- RenameIndex
ALTER TABLE `test_case` RENAME INDEX `test_case_id_soal_fkey` TO `test_case_id_soal_idx`;
