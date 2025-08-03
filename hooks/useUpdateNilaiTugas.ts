import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useUpdateNilaiTugas(praktikumId: string, tugasId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ pesertaId, totalNilai }: { pesertaId: string, tugasId: string, totalNilai: number }) => {
      const res = await fetch(
        `/api/praktikum/${praktikumId}/tugas/${tugasId}/nilai`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ pesertaId, totalNilai }),
        }
      )
      if (!res.ok) throw new Error('Gagal update nilai tugas')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Nilai tugas berhasil diupdate')
    },
    onError: () => {
      toast.error('Gagal update nilai tugas')
    }
  })
}