// app/laboran/praktikum/[id]/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UsersIcon,
  UserGroupIcon,

} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatTime, formatDate } from '@/lib/utils'
import { DataTable } from '@/components/ui/data-table'
// import { createPraktikanColumns } from './columns'
import ConfirmDeleteModal from '@/components/ConfimDeleteModal'
import { createMahasiswaColumns, createDosenColumns } from './columns'

interface PraktikumDetail {
  id: number
  nama: string
  kodePraktikum: string
  kodeMk: string
  kelas: string
  semester: 'GANJIL' | 'GENAP'
  tahun: number
  jadwalHari: string
  jadwalJamMasuk: string
  jadwalJamSelesai: string
  ruang: string
  isActive: boolean
  pesertaPraktikum: PesertaPraktikum[] | []
  asistenPraktikum: PesertaPraktikum[] | []
  dosenPraktikum: DosenPraktikum[] | []
  laboran: {
    id: number
    nama: string
    email: string
  }
  _count: {
    pesertaPraktikum: number
    asistenPraktikum: number
    dosenPraktikum: number
    tugas: number
  }
  createdAt: string
  updatedAt: string
}

interface PesertaPraktikum {
  id: number
  mahasiswa: MahasiswaData
}

interface DosenPraktikum {
  id: number
  dosen: DosenData
}

interface MahasiswaData {
  nama: string
  npm: string
}

interface DosenData {
  nama: string
  nip: string
}

export default function DetailPraktikumPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [praktikum, setPraktikum] = useState<PraktikumDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const [activeTab, setActiveTab] = useState<"peserta" | "asisten" | "dosen">("peserta")
  const columns = useMemo(()=>{
    if(activeTab === 'dosen'){
      return createDosenColumns()
    }

    return createMahasiswaColumns()
  },[activeTab])

  useEffect(() => {
    if (id) {
      fetchPraktikum()
    }
  }, [id])

  useEffect(() => {
    console.log('Setelah berubah Praktikum : ', praktikum)
  }, [praktikum])

  const fetchPraktikum = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/praktikum/${id}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        setPraktikum(result.data)
      } else {
        toast.error('Gagal mengambil data praktikum')
        router.push('/laboran/praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data')
      router.push('/laboran/praktikum')
    } finally {
      setLoading(false)
    }

  }

  const confirmDelete = async () => {
    setIsShowModalDelete(true)
  }


  const handleDelete = async () => {

    try {
      const response = await fetch(`/api/praktikum/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Praktikum berhasil dihapus')
        router.push('/laboran/praktikum')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus praktikum')
    }
  }

  const handleToggleActive = async () => {
    if (!praktikum) return

    try {
      const response = await fetch(`/api/praktikum/${id}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !praktikum.isActive })
      })

      if (response.ok) {
        toast.success(`Praktikum ${!praktikum.isActive ? 'diaktifkan' : 'dinonaktifkan'}`)
        fetchPraktikum()
      } else {
        toast.error('Gagal mengubah status praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!praktikum) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Praktikum tidak ditemukan</h1>
          <Link href="/laboran/praktikum">
            <Button>Kembali ke Daftar Praktikum</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getActiveData = () => {
    if(!praktikum) return []

    if(activeTab === 'peserta'){
      return praktikum.pesertaPraktikum.map(
        p => ({
          nama: p.mahasiswa.nama,
          npm: p.mahasiswa.npm
        })
      )
    }
    if(activeTab === 'asisten'){
      return praktikum.asistenPraktikum.map(
        p => ({
          nama: p.mahasiswa.nama,
          npm: p.mahasiswa.npm
        })
      )
    }

    if(activeTab === 'dosen'){
      return praktikum.dosenPraktikum.map(
        p => ({
          nama: p.dosen.nama,
          nip: p.dosen.nip
        })
      )
    }

    return []
  }

  


  const data = getActiveData()

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/laboran/praktikum">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {praktikum.nama}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Detail informasi praktikum {praktikum.kodePraktikum}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">

            <Link href={`/laboran/praktikum/edit/${praktikum.id}`}>
              <Button variant="outline" className="text-yellow-600 hover:text-yellow-700">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              onClick={confirmDelete}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${praktikum.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
            }`}>
            {praktikum.isActive ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <span className="text-sm text-gray-500">
            Dibuat {formatDate(praktikum.createdAt)}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UsersIcon className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Peserta</p>
              <p className="text-3xl font-bold text-gray-900">{praktikum._count.pesertaPraktikum}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AcademicCapIcon className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Asisten</p>
              <p className="text-3xl font-bold text-gray-900">{praktikum._count.asistenPraktikum}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Dosen</p>
              <p className="text-3xl font-bold text-gray-900">{praktikum._count.dosenPraktikum}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Detail Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            {/* <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2" /> */}
            <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama Praktikum</label>
              <p className="mt-1 text-sm text-gray-900">{praktikum.nama}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Kode Praktikum</label>
                <p className="mt-1 text-sm font-mono font-medium text-gray-900">{praktikum.kodePraktikum}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Kode Mata Kuliah</label>
                <p className="mt-1 text-sm font-mono font-medium text-gray-900">{praktikum.kodeMk}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Kelas</label>
              <p className="mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {praktikum.kelas}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            {/* <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" /> */}
            <h2 className="text-lg font-semibold text-gray-900">Jadwal & Lokasi</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Semester</label>
                <p className="mt-1 text-sm text-gray-900">{praktikum.semester}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tahun</label>
                <p className="mt-1 text-sm text-gray-900">{praktikum.tahun}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="">

                <label className="block text-sm font-medium text-gray-500">Hari</label>
                <p className="mt-1 text-sm text-gray-900">{praktikum.jadwalHari}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Waktu</label>
                <div className="mt-1 flex items-center">
                  {/* <ClockIcon className="h-4 w-4 text-gray-400 mr-2" /> */}
                  <p className="text-sm font-mono text-gray-900">{formatTime(praktikum.jadwalJamMasuk)} - {formatTime(praktikum.jadwalJamSelesai)}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Ruang</label>
              <p className="mt-1 text-sm text-gray-900">{praktikum.ruang}</p>
            </div>
          </div>
        </div>




      </div>



      <div className="bg-white rounded-lg shadow-sm border-gray-200 border mt-6">
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('peserta')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'peserta'
                    ? 'border-[#3ECF8E] text-[#3ECF8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Peserta ({praktikum._count.pesertaPraktikum})
              </button>
              <button
                onClick={() => setActiveTab('asisten')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'asisten'
                    ? 'border-[#3ECF8E] text-[#3ECF8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Asisten ({praktikum._count.asistenPraktikum})
              </button>
              <button
                onClick={() => setActiveTab('dosen')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dosen'
                    ? 'border-[#3ECF8E] text-[#3ECF8E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Dosen ({praktikum._count.dosenPraktikum})
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6 pt-2">
          {data.length > 0 ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <div className="text-center p-6">
              <p className="text-sm text-gray-500">Belum ada data pada tab ini.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isShowModalDelete}
        onClose={() => setIsShowModalDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Praktikum"
        message={`Apakah Anda yakin ingin menghapus praktikum ${praktikum.nama}? Semua data terkait akan dihapus.`}
        isLoading={loading}
      />



      {/* Management Information */}


      {/* Quick Actions */}
      {/* <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href={`/laboran/praktikum/${praktikum.id}/peserta`}>
            <Button variant="outline" className="w-full text-blue-600 hover:text-blue-700">
              <UsersIcon className="h-4 w-4 mr-2" />
              Kelola Peserta
            </Button>
          </Link>
          <Link href={`/laboran/praktikum/${praktikum.id}/asisten`}>
            <Button variant="outline" className="w-full text-green-600 hover:text-green-700">
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Kelola Asisten
            </Button>
          </Link>
          <Link href={`/laboran/praktikum/${praktikum.id}/dosen`}>
            <Button variant="outline" className="w-full text-purple-600 hover:text-purple-700">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Kelola Dosen
            </Button>
          </Link>
          <Link href={`/laboran/praktikum/${praktikum.id}/tugas`}>
            <Button variant="outline" className="w-full text-orange-600 hover:text-orange-700">
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              Kelola Tugas
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  )
}