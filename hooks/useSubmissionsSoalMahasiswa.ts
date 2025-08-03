import { useQuery } from "@tanstack/react-query"
import {Submission} from '@/types/submission'


const fetchSubmissionsSoalMahasiswa = async (soalId: string) : Promise<Submission[]> => {
  const res = await fetch('/api/mahasiswa/soal/' + soalId + '/submissions', {
    credentials: 'include',
  })

  if(!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Gagal mengambil data submission soal')
  }

  const data = await res.json()
  return data
}

export const useSubmissionsSoalMahasiswa = (soalId: string) => {
  return useQuery({
    queryKey: ['submissionsSoalMahasiswa', soalId],
    queryFn: () => fetchSubmissionsSoalMahasiswa(soalId),
    staleTime: 1000 * 60 * 5,
    gcTime: 10 * 60 * 1000, 
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500){
        return false;
      }
      return failureCount < 3; 
    }
  })
}