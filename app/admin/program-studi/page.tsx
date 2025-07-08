// app/admin/program-studi/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import Modal from '@/components/ui/modal'
import { createProgramStudiColumns } from './columns'
import { PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Fakultas {
  id: number
  nama: string
  kodeFakultas: string
}

interface ProgramStudi {
  id: number
  nama: string
  kodeProdi: string
  idFakultas: number
  fakultas: Fakultas
  _count: {
    mahasiswa: number
    dosen: number
  }
  createdAt: string
  updatedAt: string
}

export default function ProgramStudiPage() {
  const [data, setData] = useState<ProgramStudi[]>([])
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgramStudi, setEditingProgramStudi] = useState<ProgramStudi | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodiResponse, fakultasResponse] = await Promise.all([
        fetch('/api/program-studi', { credentials: 'include' }),
        fetch('/api/fakultas', { credentials: 'include' })
      ])

      if (prodiResponse.ok && fakultasResponse.ok) {
        const [prodiResult, fakultasResult] = await Promise.all([
          prodiResponse.json(),
          fakultasResponse.json()
        ])
        
        setData(prodiResult.programStudi)
        setFakultasList(fakultasResult.fakultas)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Gagal memuat data program studi')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProgramStudi(null)
    setIsModalOpen(true)
  }

  const handleEdit = (programStudi: ProgramStudi) => {
    setEditingProgramStudi(programStudi)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus program studi ini?')) {
      try {
        const response = await fetch(`/api/program-studi/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          setData(data.filter(prodi => prodi.id !== id))
        } else {
          const error = await response.json()
          toast.error(error.error)
        }
      } catch (error) {
        console.error('Error deleting program studi:', error)
        toast.error('Gagal menghapus program studi')
      }
    }
  }

  const handleSubmit = async (formData: { nama: string; kodeProdi: string; idFakultas: number }) => {
    setIsSubmitting(true)
    try {
      const url = editingProgramStudi ? `/api/program-studi/${editingProgramStudi.id}` : '/api/program-studi'
      const method = editingProgramStudi ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        
        if (editingProgramStudi) {
          setData(data.map(prodi => 
            prodi.id === editingProgramStudi.id ? result.programStudi : prodi
          ))
        } else {
          setData([result.programStudi, ...data])
        }
        
        setIsModalOpen(false)
        setEditingProgramStudi(null)
        toast.success(editingProgramStudi ? 'Program studi berhasil diperbarui' : 'Program studi berhasil ditambahkan')
      } else {
        const error = await response.json()
        toast.error(error.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Gagal menyimpan data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = createProgramStudiColumns({ onEdit: handleEdit, onDelete: handleDelete })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Program Studi</h1>
        <p className="mt-2 text-gray-600">
          Kelola semua program studi di SEKA
        </p>
      </div>

      {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Program Studi</div>
              <div className="text-2xl font-bold text-gray-900">{data.length}</div>
            </div>
          </div>

        

      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Data Program Studi</h2>
              <p className="text-sm text-gray-500">Kelola semua program studi di sistem</p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah Program Studi
            </button>
          </div>
        </div>

        <div className="p-6">
          {data.length > 0 ? (
            <DataTable columns={columns} data={data} searchPlaceholder="Cari program studi berdasarkan nama atau fakultas" searchableColumns={['nama', 'fakultas']} />
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada program studi</h3>
              <p className="mt-1 text-sm text-gray-500">
                Mulai dengan menambahkan program studi baru.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tambah Program Studi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProgramStudi(null)
        }}
        title={editingProgramStudi ? 'Edit Program Studi' : 'Tambah Program Studi'}
        size="md"
      >
        <ProgramStudiForm
          programStudi={editingProgramStudi}
          fakultasList={fakultasList}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingProgramStudi(null)
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  )
}

// Program Studi Form Component
function ProgramStudiForm({ 
  programStudi, 
  fakultasList,
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: {
  programStudi?: ProgramStudi | null
  fakultasList: Fakultas[]
  onSubmit: (data: { nama: string; kodeProdi: string; idFakultas: number }) => void
  onCancel: () => void
  isSubmitting?: boolean
}) {
  const [formData, setFormData] = useState({
    nama: programStudi?.nama || '',
    kodeProdi: programStudi?.kodeProdi || '',
    idFakultas: programStudi?.idFakultas || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.name === 'idFakultas' ? parseInt(e.target.value) : e.target.value
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Program Studi
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Contoh: Teknik Informatika"
          required
        />
      </div>

      <div>
        <label htmlFor="kodeProdi" className="block text-sm font-medium text-gray-700 mb-1">
          Kode Program Studi
        </label>
        <input
          type="text"
          id="kodeProdi"
          name="kodeProdi"
          value={formData.kodeProdi}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Contoh: TIF"
          required
        />
      </div>

      <div>
        <label htmlFor="idFakultas" className="block text-sm font-medium text-gray-700 mb-1">
          Fakultas
        </label>
        <select
          id="idFakultas"
          name="idFakultas"
          value={formData.idFakultas}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          required
        >
          <option value={0}>Pilih Fakultas</option>
          {fakultasList.map(fakultas => (
            <option key={fakultas.id} value={fakultas.id}>
              {fakultas.nama} ({fakultas.kodeFakultas})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3ECF8E] border border-transparent rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Menyimpan...' : programStudi ? 'Perbarui' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}