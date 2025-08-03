import { useQuery } from "@tanstack/react-query";

interface PraktikumItem {
  id: string;
  nama: string;
  kodePraktikum: string;
  kodeMk: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  jamMulai: string;
  jamSelesai: string;
  ruang: string;
  userRole: 'peserta' | 'asisten';
  peserta: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
  }>;
  asisten: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
  }>;
  tugas: Array<{
    id: string;
    judul: string;
    deskripsi: string;
    deadline: string;
    maksimalSubmit: number;
    createdAt: string;
    pembuat: string;
    totalSoal: number;
    status?: 'submitted' | 'not_submitted' | null;}>
}

const fetchPraktikumDetail = async (praktikumId: string) : Promise<PraktikumItem>=> {
  const response = await fetch(`/api/mahasiswa/praktikum/${praktikumId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Gagal mengambil detail praktikum');
  }

  return response.json();
}

export const usePraktikumDetail = (praktikumId: string, enabled = true) => {
  return useQuery({
    queryKey: ['praktikumDetail', praktikumId],
    queryFn: () => fetchPraktikumDetail(praktikumId),
    enabled: enabled && !!praktikumId, // dijalankan hanya jika praktikumId ada
    staleTime: 3 * 60 * 1000, // 3 menit
    gcTime: 10 * 60 * 1000, // 10 menit
    retry: (failureCount, error: any) => {
      if(error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    }
  })
}

