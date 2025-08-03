'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TugasDetailResponse, useTugasDetail } from '@/hooks/useTugasDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useRolePraktikum } from '@/contexts/RolePraktikumContext';
import SoalContent from '@/components/SoalContent';

export default function TugasDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const praktikumId = params.id

  const [activeTab, setActiveTab] = useState('deskripsi');
  const { isAsisten } = useRolePraktikum()
  // Fetch tugas detail
  const {
    data: tugas,
    isLoading,
    error,
    refetch
  } = useTugasDetail(
    params.id as string,
    params.tugasId as string,
    !!user
  );

  // useEffect(()=>{
  //   console.log('data tugas', tugas)
  // },[tugas])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }


  const role = isAsisten((praktikumId)) ? 'ASISTEN' : 'PESERTA';

  // Error state
  if (error || !tugas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error?.error || 'Tugas tidak ditemukan'}</p>
          <div className="space-x-3">
            <button
              onClick={() => refetch()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">

          {/* Left Sidebar */}
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            soalLength={tugas.soal.length} />

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'deskripsi' && (
              <DeskripsiContent tugas={tugas} formatDate={formatDate} />
            )}

            {activeTab === 'soal' && (
              <SoalContent tugas={tugas} role={role} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Deskripsi Content Component
const DeskripsiContent = ({
  tugas,
  formatDate
}: {
  tugas: TugasDetailResponse;
  formatDate: (date: string) => string;
}) => {

  const router = useRouter()

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-6">{tugas.judul}</h2>
        {tugas.userRole === 'asisten' && (


          <Button
            onClick={() => router.push(`/mahasiswa/praktikum/${tugas.praktikum.id}/tugas/${tugas.id}/edit`)}
            className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
          >
            <Edit /> Edit
          </Button>

        )}
      </div>

      {/* Tugas Description */}
      <div className="mb-8">
        <MarkdownRenderer content={tugas.deskripsi} />
      </div>

      {/* Tugas Info */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Informasi Tugas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Deadline</span>
              <p className={`mt-1 ${tugas.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                {formatDate(tugas.deadline)}
              </p>
            </div>


            <div>
              <span className="text-sm font-medium text-gray-500">Bahasa didukung</span>
              <p className={`mt-1  text-gray-900`}>
                {tugas.tugasBahasa.map((tb) => (
                  <span key={tb.idBahasa} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2 mb-2 text-sm">
                    {tb.bahasa.nama}
                  </span>
                ))}
              </p>
            </div>



            <div>
              <span className="text-sm font-medium text-gray-500">Maksimal Submit per Soal</span>
              <p className="mt-1 text-gray-900">{tugas.maksimalSubmit} kali</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Dibuat oleh</span>
              <p className="mt-1 text-gray-900">{tugas.pembuat.nama}</p>
              <p className="text-sm text-gray-500">{tugas.pembuat.npm}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">Dibuat pada</span>
              <p className="mt-1 text-gray-900">{formatDate(tugas.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats untuk Peserta */}
      {tugas.userRole === 'peserta' && (
        <div className="border-t pt-6 mt-6">
          <h3 className="font-medium mb-4">Progress Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-gray-900">
                {tugas.soal.length}
              </div>
              <div className="text-sm text-gray-600">Total Soal</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.soal.filter(s => s.submissionCount && s.submissionCount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Total Submission dikirim</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.nilaiTugas?.totalNilai || 0}
              </div>
              <div className="text-sm text-gray-600">
                Total Nilai ({tugas.totalBobot || 0} max)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats untuk Asisten */}
      {tugas.userRole === 'asisten' && tugas.submissionStats && (
        <div className="border-t pt-6 mt-6">
          <h3 className="font-medium mb-4">Statistik Submission</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-gray-900">
                {tugas.submissionStats.totalSubmissions}
              </div>
              <div className="text-sm text-gray-600">Total Submission</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.submissionStats.uniqueSubmitters}
              </div>
              <div className="text-sm text-gray-600">Mahasiswa Aktif</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.submissionStats.totalPeserta}
              </div>
              <div className="text-sm text-gray-600">Total Peserta</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// left sidebar component
const LeftSidebar = ({ activeTab, setActiveTab, soalLength }: { activeTab: string; setActiveTab: (tab: string) => void; soalLength: number }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg border p-2">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-2 mb-2">
          <h2 className="text-sm font-medium text-gray-900">Menu Tugas</h2>
          <button
            onClick={() => router.replace(`/mahasiswa/praktikum/${params.id}`)}
            className="text-xs text-gray-600 hover:text-gray-900 border rounded px-1 py-1 transition-colors cursor-pointer hover:bg-gray-50"
          >
            {'<'} Kembali
          </button>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('deskripsi')}
            className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${activeTab === 'deskripsi'
              ? 'bg-green-100 text-green-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Deskripsi
          </button>
          <button
            onClick={() => setActiveTab('soal')}
            className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${activeTab === 'soal'
              ? 'bg-green-100 text-green-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Soal ({soalLength})
          </button>
        </nav>
      </div>
    </div>
  )
}