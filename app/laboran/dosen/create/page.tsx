// app/laboran/dosen/create/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeftIcon,
  UserIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface FormData {
  nip: string
  nama: string
  email: string
  jabatan: string
  programStudiId: number | ''
}

interface FormErrors {
  [key: string]: string
}

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

const JABATAN_OPTIONS = [
  'Asisten Ahli',
  'Lektor',
  'Lektor Kepala',
  'Profesor',
]

export default function CreateDosenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [programStudiList, setProgramStudiList] = useState<ProgramStudi[]>([])
  const [formData, setFormData] = useState<FormData>({
    nip: '',
    nama: '',
    email: '',
    jabatan: '',
    programStudiId: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    fetchProgramStudi()
  }, [])

  const fetchProgramStudi = async () => {
    try {
      const response = await fetch('/api/program-studi', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setProgramStudiList(result.programStudi)
      } else {
        toast.error('Gagal mengambil data program studi')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mengambil data program studi')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'programStudiId' ? (value ? parseInt(value) : '') : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.nip.trim()) {
      newErrors.nip = 'NIP wajib diisi'
    } else if (!/^\d{8,20}$/.test(formData.nip)) {
      newErrors.nip = 'NIP harus berupa angka dengan panjang 8-20 digit'
    }

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi'
    } else if (formData.nama.length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.jabatan.trim()) {
      newErrors.jabatan = 'Jabatan wajib dipilih'
    }

    if (!formData.programStudiId) {
      newErrors.programStudiId = 'Program studi wajib dipilih'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki error pada form')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/dosen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Dosen berhasil dibuat!')
        router.push('/laboran/dosen')
      } else {
        const error = await response.json()
        if (error.error?.includes('NIP') || error.error?.includes('email')) {
          if (error.error.includes('NIP')) {
            setErrors({ nip: 'NIP sudah digunakan' })
          }
          if (error.error.includes('email')) {
            setErrors({ email: 'Email sudah digunakan' })
          }
        }
        toast.error(error.error || 'Gagal membuat dosen')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat membuat dosen')
    } finally {
      setLoading(false)
    }
  }

  // Group program studi by fakultas
  const groupedProgramStudi = programStudiList.reduce((acc, prodi) => {
    const fakultasNama = prodi.fakultas.nama
    if (!acc[fakultasNama]) {
      acc[fakultasNama] = []
    }
    acc[fakultasNama].push(prodi)
    return acc
  }, {} as Record<string, ProgramStudi[]>)

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/laboran/dosen">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Tambah Dosen Baru
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Isi form di bawah untuk menambahkan dosen baru
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Informasi Dosen</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIP *
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleInputChange}
                  placeholder="Contoh: 19820215200912100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm ${
                    errors.nip ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nip && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.nip}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Dr. Ahmad, M.Kom"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm ${
                    errors.nama ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nama && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.nama}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Contoh: john.doe@usk.ac.id"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan *
                </label>
                <select
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm ${
                    errors.jabatan ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih Jabatan</option>
                  {JABATAN_OPTIONS.map(jabatan => (
                    <option key={jabatan} value={jabatan}>
                      {jabatan}
                    </option>
                  ))}
                </select>
                {errors.jabatan && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.jabatan}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-5 w-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Informasi Akademik</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Studi *
              </label>
              <select
                name="programStudiId"
                value={formData.programStudiId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm ${
                  errors.programStudiId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Program Studi</option>
                {Object.entries(groupedProgramStudi).map(([fakultasNama, prodiList]) => (
                  <optgroup key={fakultasNama} label={fakultasNama}>
                    {prodiList.map(prodi => (
                      <option key={prodi.id} value={prodi.id}>
                        {prodi.nama}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.programStudiId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.programStudiId}
                </p>
              )}
            </div>
          </div>

          {/* Password Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Password Default</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Password default akan diset sebagai <code className="bg-blue-100 px-2 py-1 rounded">dosen123</code>. 
                  Dosen dapat mengubah password setelah login pertama kali.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/laboran/dosen">
              <Button type="button" variant="outline" disabled={loading}>
                Batal
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Buat Dosen
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}