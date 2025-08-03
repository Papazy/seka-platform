  // app/laboran/praktikum/[id]/manage-participants/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  UserIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { AddParticipantModal } from '@/components/modals/AddParticipantModal'
import { ImportParticipantsModal } from '@/components/modals/ImportParticipantsModal'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { createParticipantColumns } from './columns'

interface PraktikumDetail {
  id: string
  nama: string
  kodePraktikum: string
  kelas: string
  semester: string
  tahun: number
  _count: {
    pesertaPraktikum: number
    asistenPraktikum: number
    dosenPraktikum: number
  }
}

interface ParticipantData {
  id: string
  type: 'peserta' | 'asisten' | 'dosen'
  nama: string
  identifier: string // npm/nip
  email: string
  joinedAt: string
  programStudi?: {
    nama: string
    kodeProdi: string
  }
  jabatan?: string
}

export default function ManageParticipantsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [praktikum, setPraktikum] = useState<PraktikumDetail | null>(null)
  const [participants, setParticipants] = useState<ParticipantData[]>([])
  const [activeTab, setActiveTab] = useState<'peserta' | 'asisten' | 'dosen'>('peserta')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{id: string, nama: string} | null>(null)

  useEffect(() => {
    if (id) {
      fetchPraktikum()
      fetchParticipants()
    }
  }, [id, activeTab])

  const fetchPraktikum = async () => {
    try {
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
    }
  }

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/praktikum/${id}/participants?type=${activeTab}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setParticipants(result.data || [])
      } else {
        toast.error('Gagal mengambil data peserta')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data peserta')
    } finally {
      setLoading(false)
    }
  }

  const handleAddParticipant = async (data: any) => {
    try {
      const response = await fetch(`/api/praktikum/${id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          type: activeTab
        })
      })

      if (response.ok) {
        toast.success(`${getTabLabel(activeTab)} berhasil ditambahkan`)
        fetchParticipants()
        fetchPraktikum() // Update stats
        setShowAddModal(false)
      } else {
        const error = await response.json()
        toast.error(error.error || `Gagal menambahkan ${getTabLabel(activeTab).toLowerCase()}`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menambahkan peserta')
    }
  }

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const response = await fetch(`/api/praktikum/${id}/participants/${participantId}`, {
        method: 'DELETE',
        credentials: 'include',
        body: JSON.stringify({ type: activeTab })
      })

      if (response.ok) {
        toast.success(`${getTabLabel(activeTab)} berhasil dihapus`)
        fetchParticipants()
        fetchPraktikum()
        setShowDeleteModal(false)
        setDeleteTarget(null)
      } else {
        const error = await response.json()
        toast.error(error.error || `Gagal menghapus ${getTabLabel(activeTab).toLowerCase()}`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus peserta')
    }
  }

  const handleBulkRemove = async () => {
    if (selectedParticipants.length === 0) {
      toast.error('Pilih peserta yang akan dihapus')
      return
    }

    try {
      const response = await fetch(`/api/praktikum/${id}/participants/bulk-remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          participantIds: selectedParticipants,
          type: activeTab
        })
      })

      if (response.ok) {
        toast.success(`${selectedParticipants.length} ${getTabLabel(activeTab).toLowerCase()} berhasil dihapus`)
        fetchParticipants()
        fetchPraktikum()
        setSelectedParticipants([])
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menghapus peserta')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menghapus peserta')
    }
  }

  const handleChangeRole = async (participantId: string, newRole: 'peserta' | 'asisten') => {
    try {
      const response = await fetch(`/api/praktikum/${id}/participants/${participantId}/change-role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newRole })
      })

      if (response.ok) {
        toast.success('Role berhasil diubah')
        fetchParticipants()
        fetchPraktikum()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal mengubah role')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengubah role')
    }
  }

  const handleImportSuccess = () => {
    toast.success('Import berhasil')
    fetchParticipants()
    fetchPraktikum()
    setShowImportModal(false)
  }

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'peserta': return 'Peserta'
      case 'asisten': return 'Asisten'
      case 'dosen': return 'Dosen'
      default: return 'Peserta'
    }
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'peserta': return UserGroupIcon
      case 'asisten': return AcademicCapIcon
      case 'dosen': return UserIcon
      default: return UserGroupIcon
    }
  }

  const confirmDelete = (participant: ParticipantData) => {
    setDeleteTarget({
      id: participant.id,
      nama: participant.nama
    })
    setShowDeleteModal(true)
  }

  // Filter participants
  const filteredParticipants = participants.filter(participant =>
    participant.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = createParticipantColumns({
    type: activeTab,
    onRemove: confirmDelete,
    onChangeRole: handleChangeRole,
    selectedIds: selectedParticipants,
    onSelectionChange: setSelectedParticipants
  })

  if (loading && !praktikum) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
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

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href={`/laboran/praktikum/${id}`}>
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Kelola Peserta Praktikum
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {praktikum.nama} ({praktikum.kodePraktikum}) - Kelas {praktikum.kelas}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Peserta</p>
              <p className="text-2xl font-bold text-gray-900">{praktikum._count.pesertaPraktikum}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Asisten</p>
              <p className="text-2xl font-bold text-gray-900">{praktikum._count.asistenPraktikum}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Dosen</p>
              <p className="text-2xl font-bold text-gray-900">{praktikum._count.dosenPraktikum}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {(['peserta', 'asisten', 'dosen'] as const).map((tab) => {
              const Icon = getTabIcon(tab)
              const count = praktikum._count[`${tab}Praktikum` as keyof typeof praktikum._count]
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab
                      ? 'border-[#3ECF8E] text-[#3ECF8E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {getTabLabel(tab)} ({count})
                </button>
              )
            })}
          </nav>
        </div>

        {/* Actions Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Cari ${getTabLabel(activeTab).toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {selectedParticipants.length > 0 && (
                <Button
                  onClick={handleBulkRemove}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Hapus ({selectedParticipants.length})
                </Button>
              )}
              
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="text-blue-600 hover:text-blue-700"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tambah {getTabLabel(activeTab)}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : filteredParticipants.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredParticipants}
              showSearch={false}
            />
          ) : (
            <div className="text-center py-12">
              {/* <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" /> */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Tidak ada hasil' : `Belum ada ${getTabLabel(activeTab).toLowerCase()}`}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Coba ubah kata kunci pencarian'
                  : `Mulai dengan menambahkan ${getTabLabel(activeTab).toLowerCase()} atau import dari CSV`
                }
              </p>
              {!searchTerm && (
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Tambah {getTabLabel(activeTab)}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddParticipantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddParticipant}
        type={activeTab}
        praktikumId={(id)}
      />

      <ImportParticipantsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
        type={activeTab}
        praktikumId={(id)}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteTarget && handleRemoveParticipant(deleteTarget.id)}
        title={`Hapus ${getTabLabel(activeTab)}`}
        message={`Apakah Anda yakin ingin menghapus ${deleteTarget?.nama} dari praktikum ini?`}
      />
    </div>
  )
}