import { useQuery } from "@tanstack/react-query"

interface TugasResponse {
    id: number
    idPraktikum: number
    idAsisten: number
    judul: string
    deskripsi: string
    deadline: string
    maksimalSubmit: number
    createdAt: string
    updatedAt: string
    totalSoal : number
    praktikum : {
        nama: string
        kelas: string
        id: number
    }
}



const fetchTugasMahasiswa = async () : Promise<TugasResponse[]>=> {
  const response = await fetch('/api/mahasiswa/tugas', {
    credentials: 'include'
  })

  if(!response.ok){
    const errorData = await response.json()
    throw new Error(errorData.error || 'Gagal mengambil data praktikum')
  }

  return response.json()
}


export const useTugasMahasiswa = () => {
  return useQuery({
    queryKey: ['tugasMahasiswa'],
    queryFn: () => fetchTugasMahasiswa(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if(error?.status >= 400 && error?.status < 500){
        return false;
      }
      return failureCount < 2;
    }
  })
}