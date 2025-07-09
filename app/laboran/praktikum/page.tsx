// app/laboran/praktikum/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { createPraktikumColumns } from './columns'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon, 
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ImportCSVModal } from '@/components/modals/ImportCSVModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { set } from 'ace-builds-internal/config'

interface PraktikumData {
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
}

export default function PraktikumPage() {
  const [data, setData] = useState<PraktikumData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [filterSemester, setFilterSemester] = useState<string>('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchPraktikum()
  }, [])

  const fetchPraktikum = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/praktikum', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      } else {
        toast.error('Gagal mengambil data praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }



  const handleImportSuccess = () => {
    setShowImportModal(false)
    fetchPraktikum()
    toast.success('Import praktikum berhasil!')
  }

  const handleEdit = (id: number) => {
    router.push(`/laboran/praktikum/edit/${id}`)
  }


  const confirmDelete = (id: number) => {
    setSelectedDeleteId(id)
    setIsModalDeleteOpen(true)
  }

  const handleDelete = async () => {

    try {
      const response = await fetch(`/api/praktikum/${selectedDeleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Praktikum berhasil dihapus')
        setData(data.filter(item => item.id !== selectedDeleteId))
        setSelectedDeleteId(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus praktikum')
    }finally {
      setIsModalDeleteOpen(false)
    }
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/praktikum/${id}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        toast.success(`Praktikum ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
        fetchPraktikum()
      } else {
        toast.error('Gagal mengubah status praktikum')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan')
    }
  }



  const handleDetail = (id: number) => {
    router.push(`/laboran/praktikum/${id}`)
  }

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodePraktikum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeMk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laboran.nama.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesActive = filterActive === null || item.isActive === filterActive
    const matchesSemester = !filterSemester || item.semester === filterSemester

    return matchesSearch && matchesActive && matchesSemester
  })

  const columns = createPraktikumColumns({ 
    onEdit: handleEdit, 
    onDelete: confirmDelete,
    onToggleActive: handleToggleActive,
    onDetail: handleDetail
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Kelola Praktikum
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola semua praktikum yang ada di sistem
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Link href="/laboran/praktikum/create">
            <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              Buat Praktikum
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Praktikum</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Praktikum Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        

      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari praktikum berdasarkan nama, kode, mata kuliah, atau laboran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterActive === null ? '' : filterActive.toString()}
              onChange={(e) => setFilterActive(e.target.value === '' ? null : e.target.value === 'true')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
            
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
            >
              <option value="">Semua Semester</option>
              <option value="GANJIL">Ganjil</option>
              <option value="GENAP">Genap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {filteredData.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredData} 
              searchPlaceholder="Cari praktikum..."
              
              showSearch={false} // Karena sudah ada search custom
            />
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterActive !== null || filterSemester ? 'Tidak ada hasil' : 'Belum ada praktikum'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterActive !== null || filterSemester 
                  ? 'Coba ubah kriteria pencarian atau filter'
                  : 'Mulai dengan membuat praktikum pertama'
                }
              </p>
              {!searchTerm && filterActive === null && !filterSemester && (
                <Link href="/laboran/praktikum/create">
                  <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Buat Praktikum
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
        title="Import Praktikum"
        endpoint="/api/praktikum/import"
        templateEndpoint="/api/praktikum/template"
        sampleData={[
          { 
            nama: 'Praktikum Algoritma dan Pemrograman', 
            kodePraktikum: 'PRAK001', 
            kodeMk: 'TIF101', 
            kelas: 'A', 
            semester: 'GANJIL', 
            tahun: '2024', 
            jadwalHari: 'SENIN', 
            jadwalJamMasuk: '08:00', 
            jadwalJamSelesai: '10:00', 
            ruang: 'Lab Komputer 1' 
          },
          { 
            nama: 'Praktikum Struktur Data', 
            kodePraktikum: 'PRAK002', 
            kodeMk: 'TIF102', 
            kelas: 'B', 
            semester: 'GANJIL', 
            tahun: '2024', 
            jadwalHari: 'SELASA', 
            jadwalJamMasuk: '10:00', 
            jadwalJamSelesai: '12:00', 
            ruang: 'Lab Komputer 2' 
          }
        ]}
        columns={[
          { key: 'nama', label: 'Nama Praktikum' },
          { key: 'kodePraktikum', label: 'Kode Praktikum' },
          { key: 'kodeMk', label: 'Kode MK' },
          { key: 'kelas', label: 'Kelas' },
          { key: 'semester', label: 'Semester' },
          { key: 'tahun', label: 'Tahun' },
          { key: 'jadwalHari', label: 'Hari' },
          { key: 'jadwalJamMasuk', label: 'Jam Masuk' },
          { key: 'jadwalJamSelesai', label: 'Jam Selesai' },
          { key: 'ruang', label: 'Ruang' }
        ]}
      />

        <ConfirmDeleteModal 
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Praktikum"
          message={`Apakah Anda yakin ingin menghapus praktikum ini? 
            Data yang dihapus tidak dapat dikembalikan.`}
        />


    </div>
  )
}