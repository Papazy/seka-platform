'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LeftSidebar from '@/components/LeftSidebar';
import { DataTable } from '@/components/ui/data-table';
import { createRekapColumns, createSingleTugasColumns } from './columns';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRekapPraktikum } from '@/app/hooks/useRekapPraktikum';

interface RekapNilai {
  praktikum: {
    id: number;
    nama: string;
    kodePraktikum: string;
    kelas: string;
  };
  tugas: Array<{
    id: number;
    judul: string;
    totalSoal: number;
    totalBobot: number;
    deadline: string;
    soal: Array<{
      id: number;
      judul: string;
      bobotNilai: number;
    }>;
  }>;
  peserta: Array<{
    id: number;
    nama: string;
    npm: string;
    nilaiPerTugas: Array<{
      tugasId: number;
      tugasJudul: string;
      nilaiPersen: number;
      submissionCount: number;
      isSubmitted: boolean;
      lastSubmittedAt?: string;
      soalScores?: Array<{
        soalId: number;
        soalJudul: string;
        score: number;
        maxScore: number;
      }>;
    }>;
    totalNilai: number;
    rataRata: number;
    totalTugasSelesai: number;
    totalTugas: number;
  }>;
  userRole: 'peserta' | 'asisten';
}

export default function RekapNilaiPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'kelas' | number>('kelas');

  const {
    data: rekapData,
    isLoading: loading,
    error: rekapError,
    refetch: refetchRekap
  } = useRekapPraktikum(params.id as string, !!user);

  const downloadCSV = () => {
    if (!rekapData) return;

    if (selectedView === 'kelas') {
      // Download rekap kelas
      const tugasHeaders = rekapData.tugas.map(t => t.judul);
      const headers = ['No', 'NPM', 'Nama', ...tugasHeaders, 'Nilai'];
      
      const csvRows = rekapData.peserta.map((peserta, index) => {
        const tugasNilai = rekapData.tugas.map(tugas => {
          const nilai = peserta.nilaiPerTugas.find(nt => nt.tugasId === tugas.id);
          return nilai?.isSubmitted ? nilai.nilaiPersen : 0;
        });
        
        return [
          index + 1,
          peserta.npm,
          `"${peserta.nama}"`,
          ...tugasNilai,
          peserta.totalNilai
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `rekap_kelas_${rekapData.praktikum.kodePraktikum}_${rekapData.praktikum.kelas}.csv`;
      link.click();
    } else {
      // Download tugas spesifik
      const selectedTugas = rekapData.tugas.find(t => t.id === selectedView);
      if (!selectedTugas) return;

      const soalHeaders = selectedTugas.soal.map(s => s.judul);
      const headers = ['No', 'NPM', 'Nama', ...soalHeaders, 'Nilai'];
      
      const csvRows = rekapData.peserta.map((peserta, index) => {
        const nilaiTugas = peserta.nilaiPerTugas.find(nt => nt.tugasId === selectedView);
        const soalNilai = selectedTugas.soal.map(soal => {
          const soalScore = nilaiTugas?.soalScores?.find(ss => ss.soalId === soal.id);
          return soalScore ? `${soalScore.score}/${soalScore.maxScore}` : '0/0';
        });
        
        return [
          index + 1,
          peserta.npm,
          `"${peserta.nama}"`,
          ...soalNilai,
          nilaiTugas?.nilaiPersen || 0
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `rekap_${selectedTugas.judul.replace(/\s+/g, '_')}_${rekapData.praktikum.kodePraktikum}.csv`;
      link.click();
    }
  };

  if (loading) return (
    <div className="flex p-6 gap-6 max-w-7xl mx-auto">
      <div className="w-1/5">
        <LeftSidebar />
      </div>
      <div className="w-4/5">
        <div className="p-6"><LoadingSpinner/></div>
      </div>
    </div>
  );

  if (!rekapData) return (
    <div className="flex p-6 gap-6 max-w-7xl mx-auto">
      <div className="w-1/5">
        <LeftSidebar />
      </div>
      <div className="w-4/5">
        <div className="p-6">Data not found</div>
      </div>
    </div>
  );

  const getColumnsAndData = () => {
    if (!rekapData) return { columns: [], data: [] };

    if (selectedView === 'kelas') {
      return {
        columns: createRekapColumns(rekapData.tugas),
        data: rekapData.peserta
      };
    } else {
      const selectedTugas = rekapData.tugas.find(t => t.id === selectedView);
      if (!selectedTugas) return { columns: [], data: [] };

      return {
        columns: createSingleTugasColumns(selectedTugas, selectedTugas.soal),
        data: rekapData.peserta
      };
    }
  };

  const { columns, data } = getColumnsAndData();

  return (
    <div className="flex p-6 gap-6 max-w-7xl mx-auto">
      
      <div className="w-1/5">
        <LeftSidebar />
      </div>
      
      <div className="w-4/5">
        <div className="bg-white p-6 rounded-lg border">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold">Rekapitulasi Nilai</h1>
              <p className="text-gray-600">
                {rekapData.praktikum.nama} - {rekapData.praktikum.kodePraktikum} - Kelas {rekapData.praktikum.kelas}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={downloadCSV}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>

          {/* Filter Selector */}
          <div className="mb-6">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value === 'kelas' ? 'kelas' : parseInt(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="kelas">Seluruh Tugas</option>
              {rekapData.tugas.map((tugas, index) => (
                <option key={tugas.id} value={tugas.id}>
                  Tugas {index + 1}: {tugas.judul}
                </option>
              ))}
            </select>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Cari NPM atau nama..."
            
          />

        </div>
      </div>
    </div>
  );
}