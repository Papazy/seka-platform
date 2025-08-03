'use client'
import LoadingSpinner from "@/components/LoadingSpinner";
import PraktikumContainer from "@/components/PraktikumContainer";
import { Router } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ToggleViewMode from "@/components/ToggleViewMode";
import { getCurrentYearAndSemester } from "@/lib/getCurrentYearAndSemester";
import { usePraktikumMahasiswa } from "@/hooks/usePraktikumMahasiswa";
import { useViewMode } from "@/contexts/ViewModeContext";

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'active';

export default function PraktikumPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');  
  const router = useRouter()
  const {viewMode, setViewMode} = useViewMode();

  const {
    data: praktikumData,
    isLoading: praktikumLoading,
    error: praktikumError,
    refetch: refetchPraktikum
  } = usePraktikumMahasiswa(activeFilter);

  const filterBySearch = (praktikumList: Praktikum[]) => {
    if (!Array.isArray(praktikumList)) return [];

    return praktikumList.filter(praktikum =>
      praktikum.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      praktikum.kodePraktikum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      praktikum.kelas.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const pesertaPraktikum = praktikumData?.praktikum?.peserta || [];
  const asistenPraktikum = praktikumData?.praktikum?.asisten || [];


  const filterByActive = (praktikumList: Praktikum[]) => {

    if (!Array.isArray(praktikumList)) return [];
    if (activeFilter === 'all') {
      return praktikumList;
    }
    const { semester, year } = getCurrentYearAndSemester();
    return praktikumList.filter(praktikum =>
      praktikum.semester === semester &&
      praktikum.tahun === year
    )
  }

  const filteredPeserta = useMemo(() => {
    return filterByActive(filterBySearch(pesertaPraktikum));
  }, [searchQuery, pesertaPraktikum, activeFilter])

  const filteredAsisten = useMemo(() => {
    return filterByActive(filterBySearch(asistenPraktikum))
  }, [searchQuery, asistenPraktikum, activeFilter])

  const totalFilteredPraktikum = filteredPeserta.length + filteredAsisten.length;

  

  const handleClassClick = (id: string) => {
    router.push(`/mahasiswa/praktikum/${id}`);
  }

  if (praktikumLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari praktikum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] text-sm text-gray-700 bg-white shadow-sm"
              />
            </div>

            {/* Active or All selection  */}
            <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as FilterType)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] bg-white shadow-sm"
          >
            <option value="active">Semester Aktif</option>
            <option value="all">Semua Praktikum</option>
          </select>

            {/* Toggle */}
            <ToggleViewMode viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>

        {totalFilteredPraktikum === 0 ? (
          <div className="text-center py-16">
            <div className="w-12h-12bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Belum ada praktikum</h3>
            <p className="text-gray-600 text-sm">
              {searchQuery
                ? 'Tidak ada praktikum yang sesuai dengan pencarian Anda.'
                : 'Anda belum terdaftar dalam praktikum manapun untuk semester ini.'}
            </p>
          </div>
        ) : (

          <div className="space-y-10">
            {filteredAsisten.length > 0 && (
              <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-green-primary mr-4 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">Mengajar</h2>
                <span className="ml-1 text-gray-500 text-sm font-medium rounded-full">
                  ({filteredAsisten.length})
                </span>
              </div>
              <PraktikumContainer
                praktikumList={filteredAsisten}
                viewMode={viewMode}
                onClick={handleClassClick}
                />
            </div>
              )}
               {filteredPeserta.length > 0 && (

                 <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-green-primary mr-4 rounded-full"></div>
                <h2 className="text-base font-bold text-gray-900">Praktikum</h2>
                <span className="ml-1 text-gray-500 text-sm font-medium rounded-full">
                  ({filteredPeserta.length})
                </span>
              </div>
              <PraktikumContainer
                praktikumList={filteredPeserta}
                viewMode={viewMode}
                onClick={handleClassClick}
                />
            </div>
              ) }
          </div>
        )}
      </div>
    </div>
  )
}

