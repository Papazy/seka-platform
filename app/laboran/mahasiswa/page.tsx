// app/laboran/mahasiswa/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { createMahasiswaColumns } from './columns'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon, 
  UsersIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ImportCSVModal } from '@/components/modals/ImportCSVModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

interface MahasiswaData {
  id: number
  npm: string
  nama: string
  email: string
  programStudi: {
    id: number
    nama: string
    kodeProdi: string
    fakultas: {
      nama: string
      kodeFakultas: string
    }
  }
  _count: {
    pesertaPraktikum: number
    asistenPraktikum: number
  }
  createdAt: string
}

export default function MahasiswaPage() {
  const [data, setData] = useState<MahasiswaData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProdi, setFilterProdi] = useState<string>('')
  const [filterFakultas, setFilterFakultas] = useState<string>('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [programStudiList, setProgramStudiList] = useState<any[]>([])
  const [fakultasList, setFakultasList] = useState<any[]>([])
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchMahasiswa()
    fetchProgramStudi()
    fetchFakultas()
  }, [])

  useEffect(()=>{
    console.log("Fakultas Data: ", fakultasList)
    console.log("programStudi Data: ", programStudiList)
  },[fakultasList, programStudiList])

  const fetchMahasiswa = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mahasiswa', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      } else {
        toast.error('Gagal mengambil data mahasiswa')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgramStudi = async () => {
    try {
      const response = await fetch('/api/program-studi', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("Program Studi Result: ", result)
        setProgramStudiList(result.programStudi || [])
      }
    } catch (error) {
      console.error('Error fetching program studi:', error)
    }
  }

  const fetchFakultas = async () => {
    try {
      const response = await fetch('/api/fakultas', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("Fakultas Result: ", result)
        setFakultasList(result.fakultas || [])
      }
    } catch (error) {
      console.error('Error fetching fakultas:', error)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/laboran/mahasiswa/edit/${id}`)
  }


  const confirmDelete = (id: number) => {
    setIsOpenModalDelete(true)
    setSelectedDeleteId(id)
  }

  const handleDelete = async () => {

    try {
      const response = await fetch(`/api/mahasiswa/${selectedDeleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Mahasiswa berhasil dihapus')
        setData(prevData => prevData.filter(item => item.id !== selectedDeleteId))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus mahasiswa')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus mahasiswa')
    }
  }

  const handleDetail = (id: number) => {
    router.push(`/laboran/mahasiswa/${id}`)
  }

  const handleAssignPraktikum = (id: number) => {
    router.push(`/laboran/mahasiswa/${id}/assign-praktikum`)
  }

  const handleImportSuccess = () => {
    setShowImportModal(false)
    fetchMahasiswa()
    toast.success('Import mahasiswa berhasil!')
  }

  // const handleExport = async () => {
  //   try {
  //     const response = await fetch('/api/mahasiswa/export', {
  //       credentials: 'include'
  //     })
      
  //     if (response.ok) {
  //       const blob = await response.blob()
  //       const url = window.URL.createObjectURL(blob)
  //       const a = document.createElement('a')
  //       a.href = url
  //       a.download = `mahasiswa_${new Date().toISOString().split('T')[0]}.csv`
  //       document.body.appendChild(a)
  //       a.click()
  //       document.body.removeChild(a)
  //       window.URL.revokeObjectURL(url)
  //       toast.success('Export berhasil!')
  //     } else {
  //       toast.error('Gagal export data')
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //     toast.error('Terjadi kesalahan saat export')
  //   }
  // }

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.npm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.programStudi.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.programStudi.fakultas.nama.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProdi = !filterProdi || item.programStudi.id.toString() === filterProdi
    const matchesFakultas = !filterFakultas || item.programStudi.fakultas.kodeFakultas === filterFakultas

    return matchesSearch && matchesProdi && matchesFakultas
  })

  const columns = createMahasiswaColumns({ 
    onEdit: handleEdit, 
    onDelete: confirmDelete,
    onDetail: handleDetail,
    onAssignPraktikum: handleAssignPraktikum
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
            Kelola Mahasiswa
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data mahasiswa dan assign ke praktikum
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* <Button
            onClick={handleExport}
            variant="outline"
            className="text-green-600 hover:text-green-700"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export CSV
          </Button> */}
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Link href="/laboran/mahasiswa/create">
            <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Mahasiswa
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Mahasiswa</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
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
                placeholder="Cari mahasiswa berdasarkan NPM, nama, email, atau program studi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-xs"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3 text-xs">
            <select
              value={filterFakultas}
              onChange={(e) => {
                setFilterFakultas(e.target.value)
                // setFilterProdi('') // Reset prodi filter when fakultas changes
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-xs"
            >
              <option value="">Semua Fakultas</option>
              {fakultasList.map(fakultas => (
                <option key={fakultas.id} value={fakultas.kodeFakultas}>
                  {fakultas.nama}
                </option>
              ))}
            </select>
            
            <select
              value={filterProdi}
              onChange={(e) => setFilterProdi(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-xs"
            >
              <option value="">Semua Program Studi</option>
              {programStudiList
                .filter(prodi => !filterFakultas || prodi.fakultas.kodeFakultas === filterFakultas)
                .map(prodi => (
                  <option key={prodi.id} value={prodi.id}>
                    {prodi.nama}
                  </option>
                ))}
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
              searchPlaceholder="Cari mahasiswa..."
              showSearch={false} // Karena sudah ada search custom
            />
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterProdi || filterFakultas ? 'Tidak ada hasil' : 'Belum ada mahasiswa'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterProdi || filterFakultas 
                  ? 'Coba ubah kriteria pencarian atau filter'
                  : 'Mulai dengan menambahkan mahasiswa atau import dari CSV'
                }
              </p>
              {!searchTerm && !filterProdi && !filterFakultas && (
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <Link href="/laboran/mahasiswa/create">
                    <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Tambah Mahasiswa
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
        title="Import Mahasiswa"
        endpoint="/api/mahasiswa/import"
        templateEndpoint="/api/mahasiswa/template"
        sampleData={[
          { npm: '2108107010001', nama: 'Ahmad', email: 'john@mhs.usk.ac.id', programStudiId: '1' },
          { npm: '2108107010002', nama: 'Ismail', email: 'jane@mhs.usk.ac.id', programStudiId: '1' }
        ]}
        columns={[
          { key: 'npm', label: 'NPM' },
          { key: 'nama', label: 'Nama' },
          { key: 'email', label: 'Email' },
          { key: 'programStudi', label: 'Program Studi' }
        ]}
      />

      <ConfirmDeleteModal 
        isOpen={isOpenModalDelete}
        onClose={()=> setIsOpenModalDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Mahasiswa"
        message="Apakah Anda yakin ingin menghapus mahasiswa ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  )
}