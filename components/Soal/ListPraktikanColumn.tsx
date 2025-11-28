import { ListMahasiswaFromSoal } from "@/services/soal.service";
import { getRelativeTime } from "@/utils/getRelativeTime";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ListMahasiswaFromSoal>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({row, table}) => {
            return table?.getSortedRowModel()?.flatRows.indexOf(row) + 1;
        }
    },
    {
        accessorFn: (row) => row.mahasiswa.npm,
        id: "npm",
        header: "NPM",
    },
    {
        accessorFn: (row) => row.mahasiswa.nama,
        id: "nama",
        header: "Nama",
    },
    {
        accessorFn: (row) => row.submissionsStats.totalSubmission,
        id: "percobaan",
        header: "Percobaan",
        cell: ({row}) => {
            if (row.original.submissionsStats.totalSubmission === 0) {
                return "-";
            }
            return row.original.submissionsStats.totalSubmission;
        }
    },
    {
        accessorFn: (row) => row.submissionsStats.latestSubmission?.createdAt,
        id: "waktu",
        header: "Waktu",
        cell: ({row}) => {
            const date = row.original.submissionsStats.latestSubmission?.createdAt;
            if (!date) return "-";

            return getRelativeTime(date);
        }
    },
    {
        accessorFn: (row) => row.submissionsStats.highestScore,
        id: "nilai",
        header: "Nilai",
        cell: ({row}) => {
            if (row.original.submissionsStats.totalSubmission === 0) {
                return "-";
            }
            return row.original.submissionsStats.highestScore;  
        }
    }
]