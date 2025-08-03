-- CreateTable
CREATE TABLE `tugas_bahasa` (
    `id_tugas` INTEGER NOT NULL,
    `id_bahasa` INTEGER NOT NULL,

    PRIMARY KEY (`id_tugas`, `id_bahasa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tugas_bahasa` ADD CONSTRAINT `tugas_bahasa_id_tugas_fkey` FOREIGN KEY (`id_tugas`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tugas_bahasa` ADD CONSTRAINT `tugas_bahasa_id_bahasa_fkey` FOREIGN KEY (`id_bahasa`) REFERENCES `bahasa_pemrograman`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
