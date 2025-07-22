'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSoal } from '@/app/hooks/useSoal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

// Same interfaces as create page
interface SoalFormData {
  judul: string
  deskripsi: string
  batasan: string
  formatInput: string
  formatOutput: string
  batasanMemoriKb: number
  batasanWaktuEksekusiMs: number
  templateKode: string
  bobotNilai: number
  contohTestCase: ContohTestCase[]
  testCase: TestCase[]
}

interface ContohTestCase {
  id?: number
  contohInput: string
  contohOutput: string
  penjelasanInput: string
  penjelasanOutput: string
}

interface TestCase {
  id?: number
  input: string
  outputDiharapkan: string
}

export default function EditSoalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const [soalData, setSoalData] = useState<SoalFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  // Fetch soal data
  const {
    data: soal,
    isLoading: soalLoading,
    error: soalError
  } = useSoal(params.soalId as string)

  // Initialize form data when soal loads
  useEffect(() => {
    if (soal) {
      setSoalData({
        judul: soal.judul,
        deskripsi: soal.deskripsi,
        batasan: soal.batasan || '',
        formatInput: soal.formatInput || '',
        formatOutput: soal.formatOutput || '',
        batasanMemoriKb: soal.batasanMemoriKb,
        batasanWaktuEksekusiMs: soal.batasanWaktuEksekusiMs,
        templateKode: soal.templateKode || '',
        bobotNilai: soal.bobotNilai,
        contohTestCase: soal.contohTestCase.length > 0 
          ? soal.contohTestCase.map(tc => ({
              id: tc.id,
              contohInput: tc.contohInput,
              contohOutput: tc.contohOutput,
              penjelasanInput: tc.penjelasanInput,
              penjelasanOutput: tc.penjelasanOutput
            }))
          : [{
              contohInput: '',
              contohOutput: '',
              penjelasanInput: '',
              penjelasanOutput: ''
            }],
        testCase: soal.testCase?.length > 0 
          ? soal.testCase.map(tc => ({
              id: tc.id,
              input: tc.input,
              outputDiharapkan: tc.outputDiharapkan
            }))
          : [{
              input: '',
              outputDiharapkan: ''
            }]
      })
    }
  }, [soal])

  if (soalLoading || !soalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (soalError || !soal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">Soal tidak ditemukan</p>
          <Button onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation (same as create)
    if (!soalData.judul.trim()) {
      toast.error('Judul soal harus diisi')
      return
    }
    
    if (!soalData.deskripsi.trim()) {
      toast.error('Deskripsi soal harus diisi')
      return
    }

    if (soalData.testCase.length === 0 || !soalData.testCase[0].input.trim()) {
      toast.error('Minimal harus ada 1 test case')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soalData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal mengupdate soal')
      }

      toast.success('Soal berhasil diupdate!')
      router.push(`/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}`)
      
    } catch (error) {
      console.error('Error updating soal:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal mengupdate soal')
    } finally {
      setIsLoading(false)
    }
  }

  // Same helper functions as create page
  const addContohTestCase = () => {
    setSoalData(prev => prev ? ({
      ...prev,
      contohTestCase: [...prev.contohTestCase, {
        contohInput: '',
        contohOutput: '',
        penjelasanInput: '',
        penjelasanOutput: ''
      }]
    }) : null)
  }

  const removeContohTestCase = (index: number) => {
    setSoalData(prev => prev ? ({
      ...prev,
      contohTestCase: prev.contohTestCase.filter((_, i) => i !== index)
    }) : null)
  }

  const addTestCase = () => {
    setSoalData(prev => prev ? ({
      ...prev,
      testCase: [...prev.testCase, {
        input: '',
        outputDiharapkan: ''
      }]
    }) : null)
  }

  const removeTestCase = (index: number) => {
    setSoalData(prev => prev ? ({
      ...prev,
      testCase: prev.testCase.filter((_, i) => i !== index)
    }) : null)
  }

  const updateContohTestCase = (index: number, field: keyof ContohTestCase, value: string) => {
    setSoalData(prev => prev ? ({
      ...prev,
      contohTestCase: prev.contohTestCase.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }) : null)
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    setSoalData(prev => prev ? ({
      ...prev,
      testCase: prev.testCase.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }) : null)
  }

  // Render same form as create page but with "Edit" title and different submit text
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Soal</h1>
              <p className="text-gray-600 mt-1">{soal.judul}</p>
            </div>
          </div>
        </div>

        {/* Form - Same as create but with populated data */}
        <form onSubmit={handleSubmit}>
          {/* ... Rest of form identical to create page ... */}
          {/* Just change submit button text to "Update Soal" */}
          <div className="flex gap-6">
            {/* Same content as create page */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border p-6">
                {/* Form content same as create */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      variant="outline"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? 'Mengupdate...' : 'Update Soal'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}