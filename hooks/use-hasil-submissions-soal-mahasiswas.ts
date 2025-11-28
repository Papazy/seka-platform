import { fetchHasilSubmissionSoalMahasiswa } from "@/fetchServices/soal"
import { ListMahasiswaFromSoal } from "@/services/soal.service"
import { useQuery } from "@tanstack/react-query"

export const useHasilSubmissionsSoalMahasiswas = (soalId: string) => {
    return useQuery({
        queryKey: ["hasil-submissions-soal-mahasiswas", soalId],
        queryFn: () => fetchHasilSubmissionSoalMahasiswa(soalId),
        staleTime: 5 * 60 * 1000, // 5 menit
        gcTime: 10 * 60 * 1000,
    })
}