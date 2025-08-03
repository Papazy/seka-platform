import { useQuery } from "@tanstack/react-query"

export interface Bahasa {
  id: string
  nama: string
  ekstensi: string
  compiler: string
  versi: string
  createdAt: string
  updatedAt: string
}

const fetchBahasa = async () : Promise<Bahasa[]> => {
  const response = await fetch('/api/bahasa-pemrograman', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data bahasa');
  }

  const data = await response.json();
  return data;
}

export const useBahasa = () => {
  return useQuery({
    queryKey: ['bahasa'],
    queryFn: fetchBahasa,
  });
}