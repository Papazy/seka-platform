import { useQuery } from "@tanstack/react-query";

interface PesertaData {
  praktikum: {
    id: string;
    nama: string;
    kodePraktikum: string;
    kelas: string;
  };

  dosen: Array<{ nama: string; nip: string; email: string }>;

  asisten: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
    programStudi: {
      nama: string;
      kodeProdi: string;
    };
  }>;
  peserta: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
    programStudi: {
      nama: string;
      kodeProdi: string;
    };
    stats: {
      totalTugasSelesai: number;
      totalTugas: number;
      rataRataNilai: number;
    };
  }>;
  userRole: "peserta" | "asisten";
}

const fetchPesertaData = async (praktikumId: any): Promise<PesertaData> => {
  const response = await fetch(
    `/api/mahasiswa/praktikum/${praktikumId}/peserta`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil data peserta praktikum");
  }
  const data = await response.json();
  return data;
};

export const usePesertaPraktikum = (praktikumId: any, enabled = true) => {
  return useQuery({
    queryKey: ["pesertaPraktikum", praktikumId],
    queryFn: () => fetchPesertaData(praktikumId),
    enabled: enabled && !!praktikumId, // dijalankan hanya jika praktikumId ada
    staleTime: 3 * 60 * 1000, // 3 menit
    gcTime: 10 * 60 * 1000, // 10 menit
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
