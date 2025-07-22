// app/hooks/useTugasDetail.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface TugasDetailResponse {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
  maksimalSubmit: number;
  createdAt: string;
  isOverdue: boolean;
  userRole: 'peserta' | 'asisten';
  praktikum: {
    nama: string;
    kodePraktikum: string;
    kelas: string;
    id: number;
  };
  pembuat: {
    nama: string;
    npm: string;
  };
  soal: Array<{
    id: number;
    judul: string;
    deskripsi: string;
    batasan: string;
    formatInput: string;
    formatOutput: string;
    batasanMemoriKb: number;
    batasanWaktuEksekusiMs: number;
    templateKode: string;
    bobotNilai: number;
    contohTestCase: Array<{
      id: number;
      contohInput: string;
      contohOutput: string;
      penjelasanInput: string;
      penjelasanOutput: string;
    }>;
    totalTestCase: number;
    userSubmissions?: Array<{
      id: number;
      score: number;
      attemptNumber: number;
      submittedAt: string;
      bahasa: { nama: string; ekstensi: string };
      testCaseResults: Array<{
        status: string;
        outputDihasilkan?: string;
        waktuEksekusiMs?: number;
        memoriKb?: number;
      }>;
    }>;
    bestScore?: number;
    submissionCount?: number;
    canSubmit?: boolean;
    totalSubmissions?: number;
  }>;
  nilaiTugas?: {
    totalNilai: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  totalBobot?: number;
  submissionStats?: {
    totalSubmissions: number;
    uniqueSubmitters: number;
    totalPeserta: number;
  };
}

interface ApiError {
  error: string;
  status?: number;
}

const fetchTugasDetail = async (
  praktikumId: string,
  tugasId: string
): Promise<TugasDetailResponse> => {
  const response = await fetch(
    `/api/mahasiswa/praktikum/${praktikumId}/tugas/${tugasId}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    let errorMessage = 'Failed to fetch tugas detail'
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage
    }
    
    const error = new Error(errorMessage) as Error & { status: number }
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return data
}

export const useTugasDetail = (
  praktikumId: string,
  tugasId: string,
  enabled = true
) => {
  return useQuery<TugasDetailResponse, ApiError>({
    queryKey: ['tugas-detail', praktikumId, tugasId],
    queryFn: () => fetchTugasDetail(praktikumId, tugasId),
    enabled: enabled && !!praktikumId && !!tugasId,
    staleTime: 2 * 60 * 1000, // 2 menit
    gcTime: 10 * 60 * 1000, // 10 menit (formerly cacheTime)
    retry: (failureCount, error) => {
      if (error.status && error.status >= 400 && error.status < 500) {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

// Helper hook for invalidating tugas detail cache
export const useInvalidateTugasDetail = () => {
  const queryClient = useQueryClient()
  
  return {
    invalidateById: (praktikumId: string, tugasId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['tugas-detail', praktikumId, tugasId]
      })
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: ['tugas-detail']
      })
    }
  }
}