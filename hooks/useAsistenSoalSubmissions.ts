import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const fetchAsistenSoalSubmissions = async (praktikumId: string, tugasId: string, soalId: string) => {
  const res = await fetch(
    `/api/praktikum/${praktikumId}/tugas/${tugasId}/soal/${soalId}/submissions`,
    { credentials: 'include' }
  )
  if (!res.ok) throw new Error('Gagal fetch submissions')
  return res.json()
}


export function useAsistenSoalSubmissions(praktikumId: string, tugasId: string, soalId: string) {
  return useQuery({
    queryKey: ['asisten', 'submissions', praktikumId, tugasId, soalId],
    queryFn: () => fetchAsistenSoalSubmissions(praktikumId, tugasId, soalId),
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000
  })
}


export function useUpdateSubmissionScore(praktikumId: string, tugasId: string, soalId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ submissionId, score }: { submissionId: string, score: number }) => {
      const res = await fetch(
        `/api/praktikum/${praktikumId}/tugas/${tugasId}/soal/${soalId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ submissionId, score }),
        }
      )
      if (!res.ok) throw new Error('Gagal update score')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asisten', 'submissions', praktikumId, tugasId, soalId] })
      toast.success('Score berhasil diupdate')
    },
    onError: () => {
      toast.error('Gagal update score')
    }
  })
}