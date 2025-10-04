import { useQuery } from "@tanstack/react-query";

export interface Bahasa {
  id: string;
  nama: string;
  ekstensi: string;
  compiler: string;
  versi: string;
  createdAt: string;
  updatedAt: string;
}

const fetchBahasaTugas = async (tugasId: any): Promise<Bahasa[]> => {
  const response = await fetch(`/api/bahasa-pemrograman/tugas/${tugasId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data bahasa");
  }

  const data = await response.json();
  return data;
};

export const useBahasaTugas = (tugasId: any) => {
  return useQuery({
    queryKey: ["bahasa", tugasId],
    queryFn: () => fetchBahasaTugas(tugasId),
  });
};
