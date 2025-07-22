import { useQuery } from "@tanstack/react-query"

interface Soal {
  id: number
  idTugas: number
  judul: string
  deskripsi: string
  batasan: string
  formatInput: string
  formatOutput: string
  batasanMemoriKb: number
  batasanWaktuEksekusiMs: number
  templateKode: string | null
  bobotNilai: number | 100
  createdAt: string
  updatedAt: string
  contohTestCase: [
      {
          id: number
          idSoal: number
          contohInput: string
          contohOutput: string
          penjelasanInput: string
          penjelasanOutput: string
          createdAt: string
      }
  ]
}

const fetchSoal = async (id: string) : Promise<Soal>=> {
  const response = await fetch(`/api/soal/${id}` ,
  {
    credentials: 'include'
  })

  if(!response.ok){
    throw new Error('error fetching soal')
  }

  const result = await response.json()
  return result
}

export const useSoal = (soalId: string) => {
  return useQuery({
    queryKey: ['soal', soalId],
    queryFn: () => fetchSoal(soalId),
  })
}

