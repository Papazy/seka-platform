'use client'
import { useTugasMahasiswa } from "@/app/hooks/useTugasMahasiswa";
import LoadingSpinner from "@/components/LoadingSpinner";
import ToggleViewMode from "@/components/ToggleViewMode";
import { useViewMode } from "@/contexts/ViewModeContext";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react"

interface TugasData {
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
        id: number
        nama: string
        kelas: string
    }
}

export default function TugasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { viewMode, setViewMode } = useViewMode();

    const {
        data: tugasData,
        isLoading,
        isError,
        refetch : refetchTugas,
    } =  useTugasMahasiswa()
    const router = useRouter()
    
    const handleClick = useCallback((praktikumId: number, tugasId: number) => {
        router.push(`/mahasiswa/praktikum/${praktikumId}/tugas/${tugasId}`)
    },[router] )

    if(isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
          <div className="flex items-center justify-center min-h-screen text-red-500">
            Gagal memuat data tugas. Silakan coba lagi.
          </div>
        );
      }

    return (
        <div className="min-h-screen bg-gray-50 px-8">
                {/* Header */}
            {/* <div className="max-w-7xl mx-auto py-8 px-8">
                <div className="">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w md">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari Tugas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] text-sm text-gray-700 bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Content */}
            <div className="max-w-7xl mx-auto py-4 px-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-8 bg-green-primary rounded-full mr-4"></div>
                    <h2 className="text-base font-bold text-gray-900">
                        Daftar Tugas Aktif
                    </h2>
                </div>
                <div className="space-y-2">
                    {/* tampilan bila belum ada tugas */}

                    {tugasData?.length === 0 && (<div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-center text-gray-500">
                            Belum ada tugas
                        </div>
                    </div>)}

                    {tugasData?.map((tugas) => (
                        <TugasCard key={tugas.id} tugas={tugas} onClick={() => handleClick(tugas.praktikum.id, tugas.id)} />
                        
                    ))}

                    {/* <TugasCard tugas={{ id: 1, nama: "Tugas 1", kelas: "A", deadline: "2025-01-29", soalCount: 5 }} />
                    <TugasCard tugas={{ id: 3, nama: "Tugas 3", kelas: "C", deadline: "2025-02-12", soalCount: 4 }} /> */}
                </div>
            </div>
        </div>
    )
}


const TugasCard = ({ tugas, onClick }: { tugas: TugasData, onClick : () => void }) => {
    const now = useMemo(()=>new Date(), []) 
    const deadline = useMemo(()=>new Date(tugas.deadline),[tugas.deadline])
    const deadlineDate = deadline.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    const diffMs = deadline.getTime() - now.getTime()

    // 1 hari = 24 jam * 60 Menit * 60 detik * 1000 ms
    const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000))

    return (
        <div 
        onClick={onClick}
        className="bg-white flex justify-between rounded-lg shadow-sm border border-gray-200 px-4 py-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-shadow duration-200">
            <div className="">
                <div className="text-base">{tugas.judul}</div>
                <div className="text-sm text-gray-600 my-3">
                    {tugas.deskripsi}
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                    <span>Deadline: {deadlineDate}</span>
                    <span>{tugas.totalSoal} soal</span>
                </div>
            </div>
            <div className="text-right flex flex-col justify-between">
                <div className="">

                    <div className="font-medium text-base">{tugas.praktikum.nama}</div>
                    <div className="text-xs text-gray-500">Kelas {tugas.praktikum.kelas}</div>
                </div>
                <div className="text-red-400 text-sm">{diffDays } hari lagi</div>
            </div>
        </div>
    )
}