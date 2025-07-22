// app/laboran/mahasiswa/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeftIcon,
  UserIcon,
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  EnvelopeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

interface ProgramStudi {
  id: number
  nama: string
  kodeProdi: string
  fakultas: {
    id: number
    nama: string
    kodeFakultas: string
  }
}

interface PraktikumInfo {
  id: number
  nama: string
  kodePraktikum: string
  kelas: string
  semester: string
  tahun: number
  status: string
  role: 'peserta' | 'asisten'
  joinedAt: string
  praktikum: {
    jadwalHari: string
    ruang: string
    dosen?: {
      nama: string
    }[]
  }
}

interface MahasiswaDetail {
  id: number
  npm: string
  nama: string
  email: string
  programStudi: ProgramStudi
  _count: {
    pesertaPraktikum: number
    asistenPraktikum: number
  }
  pesertaPraktikum: PraktikumInfo[]
  asistenPraktikum: PraktikumInfo[]
  createdAt: string
  updatedAt: string
}

export default function MahasiswaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [mahasiswa, setMahasiswa] = useState<MahasiswaDetail | null>(null)
  const [activeTab, setActiveTab] = useState< 'peserta' | 'asisten'>('peserta')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchMahasiswa()
    }
  }, [id])

  const fetchMahasiswa = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/mahasiswa/${id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setMahasiswa(result.data)
      } else {
        toast.error('Gagal mengambil data mahasiswa')
        router.push('/laboran/mahasiswa')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data')
      router.push('/laboran/mahasiswa')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/mahasiswa/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Mahasiswa berhasil dihapus')
        router.push('/laboran/mahasiswa')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus mahasiswa')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus mahasiswa')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!mahasiswa) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mahasiswa tidak ditemukan</h1>
          <Link href="/laboran/mahasiswa">
            <Button>Kembali ke Daftar Mahasiswa</Button>
          </Link>
        </div>
      </div>
    )
  }

  const allPraktikum = [
    ...mahasiswa.pesertaPraktikum.map(p => ({ ...p, role: 'peserta' as const })),
    ...mahasiswa.asistenPraktikum.map(p => ({ ...p, role: 'asisten' as const }))
  ].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/laboran/mahasiswa">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Detail Mahasiswa
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Informasi lengkap mahasiswa {mahasiswa.npm}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/laboran/mahasiswa/edit/${id}`}>
              <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-[#3ECF8E] to-[#2EBF7B] rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{mahasiswa.nama}</h2>
                <p className="text-gray-600 font-mono">{mahasiswa.npm}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {mahasiswa.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {mahasiswa.programStudi.nama}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  {mahasiswa.programStudi.kodeProdi} • {mahasiswa.programStudi.fakultas.kodeFakultas}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Bergabung {formatDate(mahasiswa.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Peserta Praktikum</p>
                <p className="text-2xl font-bold text-gray-900">{mahasiswa._count.pesertaPraktikum}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asisten Praktikum</p>
                <p className="text-2xl font-bold text-gray-900">{mahasiswa._count.asistenPraktikum}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Praktikum</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mahasiswa._count.pesertaPraktikum + mahasiswa._count.asistenPraktikum}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('peserta')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'peserta'
                    ? 'border-[#3ECF8E] text-[#3ECF8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                 Peserta ({mahasiswa._count.pesertaPraktikum})
              </button>
              <button
                onClick={() => setActiveTab('asisten')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'asisten'
                    ? 'border-[#3ECF8E] text-[#3ECF8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                 Asisten ({mahasiswa._count.asistenPraktikum})
              </button>
            </nav>
          </div>

          <div className="p-6">

            {/* Peserta Tab */}
            {activeTab === 'peserta' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Praktikum Praktikum
                  </h3>
                  <span className="text-sm text-gray-500">
                    {mahasiswa.pesertaPraktikum.length} praktikum
                  </span>
                </div>
                
                {mahasiswa.pesertaPraktikum.length > 0 ? (
                  <div className="space-y-4">
                    {mahasiswa.pesertaPraktikum.map((praktikum, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{praktikum.nama}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                               Kelas {praktikum.kelas}
                            </p>
                            {/* <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {praktikum.praktikum.jadwalHari}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {praktikum.praktikum.ruang}
                              </span>
                              <span>
                                {praktikum.semester} {praktikum.tahun}
                              </span>
                            </div> */}
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Peserta
                            </span>
                            {/* <p className="text-xs text-gray-500 mt-1">
                              Bergabung {formatDate(praktikum.joinedAt)}
                            </p> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum menjadi peserta</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Mahasiswa ini belum terdaftar Praktikum praktikum
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Asisten Tab */}
            {activeTab === 'asisten' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Praktikum Mengajar
                  </h3>
                  <span className="text-sm text-gray-500">
                    {mahasiswa.asistenPraktikum.length} praktikum
                  </span>
                </div>
                
                {mahasiswa.asistenPraktikum.length > 0 ? (
                  <div className="space-y-4">
                    {mahasiswa.asistenPraktikum.map((praktikum, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{praktikum.nama}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                               Kelas {praktikum.kelas}
                            </p>
                            {/* <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {praktikum.praktikum.jadwalHari}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {praktikum.praktikum.ruang}
                              </span>
                              <span>
                                {praktikum.semester} {praktikum.tahun}
                              </span>
                            </div> */}
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Asisten
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum menjadi asisten</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Mahasiswa ini belum ditugaskan Mengajar praktikum
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Mahasiswa"
        message={`Apakah Anda yakin ingin menghapus mahasiswa ${mahasiswa.nama} (${mahasiswa.npm})? Data yang dihapus tidak dapat dikembalikan.`}
      />
    </div>
  )
}