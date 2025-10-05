"use client";

import { ColumnDef } from "@tanstack/react-table";

interface PesertaNilai {
  id: string;
  nama: string;
  npm: string;
  nilaiPerTugas: Array<{
    tugasId: string;
    tugasJudul: string;
    nilaiPersen: number;
    submissionCount: number;
    isSubmitted: boolean;
    lastSubmittedAt?: string;
    soalScores?: Array<{
      soalId: string;
      soalJudul: string;
      score: number;
      maxScore: number;
    }>;
  }>;
  totalNilai: number; // nilai keseluruhan dalam persen
  rataRata: number;
  totalTugasSelesai: number;
  totalTugas: number;
}

//   Columns untuk rekap seluruh kelas
export const createRekapColumns = (
  tugasList: Array<{ id: string; judul: string }>,
): ColumnDef<PesertaNilai>[] => [
  {
    header: "No",
    id: "no",
    cell: ({ row }) => row.index + 1,
    size: 50,
  },
  {
    accessorKey: "npm",
    header: "NPM",
    cell: ({ row }) => (
      <div>
        <div className="font-mono text-sm font-medium">{row.original.npm}</div>
        <div className="text-sm text-gray-600">{row.original.nama}</div>
      </div>
    ),
    size: 180,
  },
  // Dynamic tugas columns
  ...tugasList.map(tugas => ({
    id: `tugas_${tugas.id}`,
    header: tugas.judul,
    cell: ({ row }: { row: any }) => {
      const nilaiTugas = row.original.nilaiPerTugas.find(
        (nt: any) => nt.tugasId === tugas.id,
      );

      if (!nilaiTugas || !nilaiTugas.isSubmitted) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="text-center">
          <span className="font-medium text-sm">{nilaiTugas.nilaiPersen}</span>
        </div>
      );
    },
    size: 100,
  })),
  {
    accessorKey: "totalNilai",
    header: "Nilai",
    cell: ({ row }) => (
      <div className="text-center font-bold">{row.original.totalNilai}</div>
    ),
    size: 80,
  },
];

//   Columns untuk tugas spesifik (per soal)
export const createSingleTugasColumns = (
  tugas: { id: string; judul: string; totalSoal: number; totalBobot: number },
  soalList: Array<{ id: string; judul: string; bobotNilai: number }>,
): ColumnDef<PesertaNilai>[] => [
  {
    header: "No",
    id: "no",
    cell: ({ row }) => row.index + 1,
    size: 50,
  },
  {
    accessorKey: "npm",
    header: "NPM",
    cell: ({ row }) => (
      <div>
        <div className="font-mono text-sm  font-medium">{row.original.npm}</div>
        <div className="text-sm text-gray-600">{row.original.nama}</div>
      </div>
    ),
    size: 180,
  },
  // Dynamic soal columns
  ...soalList.map(soal => ({
    id: `soal_${soal.id}`,
    header: soal.judul,
    cell: ({ row }: { row: any }) => {
      const nilaiTugas = row.original.nilaiPerTugas.find(
        (nt: any) => nt.tugasId === tugas.id,
      );
      const soalScore = nilaiTugas?.soalScores?.find(
        (ss: any) => ss.soalId === soal.id,
      );

      if (!soalScore) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="text-center">
          <span className="font-medium text-sm">{soalScore.score}</span>
        </div>
      );
    },
    size: 100,
  })),
  {
    id: "tugasNilai",
    header: "Nilai",
    cell: ({ row }) => {
      const nilaiTugas = row.original.nilaiPerTugas.find(
        nt => nt.tugasId === tugas.id,
      );

      if (!nilaiTugas || !nilaiTugas.isSubmitted) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="text-center font-bold">{nilaiTugas.nilaiPersen}</div>
      );
    },
    size: 80,
  },
];
