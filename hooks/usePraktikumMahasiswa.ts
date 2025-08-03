import { useQuery } from "@tanstack/react-query";

interface PraktikumItem {
  id: string;
  nama: string;
  kodePraktikum: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  ruang: string;
  role: 'asisten' | 'peserta';
  isActive: boolean;
}

interface PraktikumResponse {
  praktikum: {
    peserta: PraktikumItem[]
    asisten: PraktikumItem[]
  }
}

const fetchPraktikumMahasiswa = async (filter = 'active') : Promise<PraktikumResponse> => {
  const response = await fetch(`/api/mahasiswa/praktikum?filter=${filter}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Gagal mengambil data praktikum')
  }

  return response.json()
}

export const usePraktikumMahasiswa = (filter: 'active' | 'all' = 'active') => {
  return useQuery({
    queryKey: ['praktikumMahasiswa', filter],
    queryFn: () => fetchPraktikumMahasiswa(filter),
    staleTime: 1000 * 60 * 5, // 5 menit
    gcTime: 10 * 60 * 1000, // 10 menit
    retry: (failureCount, error: any) => {
      // tidak retry jika di error 4xx
      if (error?.status >= 400 && error?.status < 500){
        return false;
      }
      return failureCount < 3; // retry maksimal 3 kali
    }

  })
}