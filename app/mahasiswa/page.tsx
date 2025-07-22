'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import PraktikumCard from '@/components/PraktikumCard';
import PraktikumContainer from '@/components/PraktikumContainer';
import { usePraktikumMahasiswa } from '../hooks/usePraktikumMahasiswa';
import { useViewMode } from '@/contexts/ViewModeContext';


interface PraktikumItem {
  id: number;
  nama: string;
  kodePraktikum: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  ruang: string;
  role: 'peserta' | 'asisten';
  isActive: boolean;
}

type ViewMode = 'grid' | 'list';

export default function ClassPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoading } = useAuth();
  const {viewMode, setViewMode} = useViewMode();


  const {
    data: praktikumData,
    isLoading: praktikumLoading,
    error: praktikumError,
    refetch: refetchPraktikum
  } = usePraktikumMahasiswa('active');

  const pesertaPraktikum = praktikumData?.praktikum?.peserta || []
  const asistenPraktikum = praktikumData?.praktikum?.asisten || []

  const filterBySearch = (items: PraktikumItem[]) => {
    if (!Array.isArray(items)) return [];
  
    return items.filter(item => 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodePraktikum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPeserta = filterBySearch(pesertaPraktikum);
  const filteredAsisten = filterBySearch(asistenPraktikum);
  const totalPraktikum = pesertaPraktikum.length + asistenPraktikum.length;
  const totalFilteredPraktikum = filteredPeserta.length + filteredAsisten.length;

  const handleClassClick = (id: number) => {
    router.push(`/mahasiswa/praktikum/${id}`);
  };

  if (isLoading || praktikumLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (praktikumError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Memuat Data</h3>
            <p className="text-gray-600 mb-6">{praktikumError}</p>
            <button
              onClick={() => refetchPraktikum()}
              className="bg-[#3ECF8E] text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls - Pencarian dan View Toggle */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 ">
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

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#3ECF8E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#3ECF8E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
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
            {/* Praktikum Mengajar */}
            {filteredAsisten.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-green-primary rounded-full mr-4"></div>
                  <h2 className="text-base font-bold text-gray-900">
                    Mengajar 
                  </h2>
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

            {/* Praktikum Praktikum */}
            {filteredPeserta.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-green-primary rounded-full mr-4"></div>
                  <h2 className="text-base font-bold text-gray-900">
                    Praktikum
                  </h2>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}




