import { useQuery } from "@tanstack/react-query";

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


const fetchRekapPraktikum = async (praktikumId: string): Promise<RekapNilai> => {
  const response = await fetch(`/api/mahasiswa/praktikum/${praktikumId}/rekap`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data rekap praktikum');
  }
  
  const data = await response.json();
  return data;
}

export const useRekapPraktikum = (praktikumId: string, enabled = true) => {
  return useQuery({
    queryKey: ['rekapPraktikum', praktikumId],
    queryFn: () => fetchRekapPraktikum(praktikumId),
    enabled,
  });
};