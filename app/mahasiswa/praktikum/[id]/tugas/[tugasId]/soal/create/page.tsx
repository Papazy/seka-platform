'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTugasDetail } from '@/app/hooks/useTugasDetail'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

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
  contohInput: string
  contohOutput: string
  penjelasanInput: string
  penjelasanOutput: string
}

interface TestCase {
  input: string
  outputDiharapkan: string
}

const initialSoalData: SoalFormData = {
  judul: '',
  deskripsi: '',
  batasan: '',
  formatInput: '',
  formatOutput: '',
  batasanMemoriKb: 32768,
  batasanWaktuEksekusiMs: 1000,
  templateKode: '',
  bobotNilai: 25,
  contohTestCase: [
    {
      contohInput: '',
      contohOutput: '',
      penjelasanInput: '',
      penjelasanOutput: ''
    }
  ],
  testCase: [
    {
      input: '',
      outputDiharapkan: ''
    }
  ]
}

export default function CreateSoalPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const [soalData, setSoalData] = useState<SoalFormData>(initialSoalData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  // Fetch tugas detail untuk validasi
  const {
    data: tugas,
    isLoading: tugasLoading,
    error: tugasError
  } = useTugasDetail(
    params.id as string,
    params.tugasId as string,
    !!user
  )


  useEffect(() => {
    if (tugas && tugas.userRole !== 'asisten') {
      toast.error('Hanya asisten yang dapat membuat soal')
      router.back()
    }
  }, [tugas, router])

  if (tugasLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (tugasError || !tugas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">Tugas tidak ditemukan</p>
          <Button onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
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
      const response = await fetch(`/api/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soalData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal membuat soal')
      }

      const result = await response.json()
      toast.success('Soal berhasil dibuat!')
      router.push(`/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}`)
      
    } catch (error) {
      console.error('Error creating soal:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal membuat soal')
    } finally {
      setIsLoading(false)
    }
  }

  const addContohTestCase = () => {
    setSoalData(prev => ({
      ...prev,
      contohTestCase: [...prev.contohTestCase, {
        contohInput: '',
        contohOutput: '',
        penjelasanInput: '',
        penjelasanOutput: ''
      }]
    }))
  }

  const removeContohTestCase = (index: number) => {
    setSoalData(prev => ({
      ...prev,
      contohTestCase: prev.contohTestCase.filter((_, i) => i !== index)
    }))
  }

  const addTestCase = () => {
    setSoalData(prev => ({
      ...prev,
      testCase: [...prev.testCase, {
        input: '',
        outputDiharapkan: ''
      }]
    }))
  }

  const removeTestCase = (index: number) => {
    setSoalData(prev => ({
      ...prev,
      testCase: prev.testCase.filter((_, i) => i !== index)
    }))
  }

  const updateContohTestCase = (index: number, field: keyof ContohTestCase, value: string) => {
    setSoalData(prev => ({
      ...prev,
      contohTestCase: prev.contohTestCase.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }))
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    setSoalData(prev => ({
      ...prev,
      testCase: prev.testCase.map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }))
  }

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
                Kembali ke Tugas
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Buat Soal Baru</h1>
              <p className="text-gray-600 mt-1">Tugas: {tugas.judul}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6">
            
            {/* Left Sidebar - Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Form Soal</h2>
                <nav className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${
                      activeTab === 'info'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Informasi Dasar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('deskripsi')}
                    className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${
                      activeTab === 'deskripsi'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Deskripsi Soal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contoh')}
                    className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${
                      activeTab === 'contoh'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Contoh Test Case
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('testcase')}
                    className={`w-full text-sm text-left px-3 py-2 rounded transition-colors ${
                      activeTab === 'testcase'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Test Case
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border p-6">
                
                {/* Tab: Informasi Dasar */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul Soal *
                        </label>
                        <input
                          type="text"
                          value={soalData.judul}
                          onChange={(e) => setSoalData(prev => ({ ...prev, judul: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Masukkan judul soal"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bobot Nilai *
                        </label>
                        <input
                          type="number"
                          value={soalData.bobotNilai}
                          onChange={(e) => setSoalData(prev => ({ ...prev, bobotNilai: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batas Waktu (ms)
                        </label>
                        <input
                          type="number"
                          value={soalData.batasanWaktuEksekusiMs}
                          onChange={(e) => setSoalData(prev => ({ ...prev, batasanWaktuEksekusiMs: parseInt(e.target.value) || 1000 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          min="100"
                          step="100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batas Memori (KB)
                        </label>
                        <input
                          type="number"
                          value={soalData.batasanMemoriKb}
                          onChange={(e) => setSoalData(prev => ({ ...prev, batasanMemoriKb: parseInt(e.target.value) || 32768 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          min="1024"
                          step="1024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Kode
                      </label>
                      <textarea
                        value={soalData.templateKode}
                        onChange={(e) => setSoalData(prev => ({ ...prev, templateKode: e.target.value }))}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                        placeholder="Template kode untuk mahasiswa (opsional)"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Deskripsi Soal */}
                {activeTab === 'deskripsi' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold mb-4">Deskripsi Soal</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Soal * (Markdown)
                      </label>
                      <textarea
                        value={soalData.deskripsi}
                        onChange={(e) => setSoalData(prev => ({ ...prev, deskripsi: e.target.value }))}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Deskripsi lengkap soal dalam format Markdown..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Gunakan format Markdown untuk formatting teks</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format Input
                      </label>
                      <textarea
                        value={soalData.formatInput}
                        onChange={(e) => setSoalData(prev => ({ ...prev, formatInput: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Jelaskan format input yang diharapkan..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format Output
                      </label>
                      <textarea
                        value={soalData.formatOutput}
                        onChange={(e) => setSoalData(prev => ({ ...prev, formatOutput: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Jelaskan format output yang diharapkan..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batasan
                      </label>
                      <textarea
                        value={soalData.batasan}
                        onChange={(e) => setSoalData(prev => ({ ...prev, batasan: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Batasan input, constraints, dll..."
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Contoh Test Case */}
                {activeTab === 'contoh' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Contoh Test Case</h2>
                      <Button
                        type="button"
                        onClick={addContohTestCase}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Contoh
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {soalData.contohTestCase.map((testCase, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Contoh Test Case #{index + 1}</h3>
                            {soalData.contohTestCase.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeContohTestCase(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contoh Input
                              </label>
                              <textarea
                                value={testCase.contohInput}
                                onChange={(e) => updateContohTestCase(index, 'contohInput', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                                placeholder="Input contoh..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contoh Output
                              </label>
                              <textarea
                                value={testCase.contohOutput}
                                onChange={(e) => updateContohTestCase(index, 'contohOutput', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                                placeholder="Output yang diharapkan..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Penjelasan Input
                              </label>
                              <textarea
                                value={testCase.penjelasanInput}
                                onChange={(e) => updateContohTestCase(index, 'penjelasanInput', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Penjelasan input..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Penjelasan Output
                              </label>
                              <textarea
                                value={testCase.penjelasanOutput}
                                onChange={(e) => updateContohTestCase(index, 'penjelasanOutput', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Penjelasan output..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Test Case */}
                {activeTab === 'testcase' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Test Case untuk Grading</h2>
                        <p className="text-sm text-gray-600 mt-1">Test case ini akan digunakan untuk menilai submission mahasiswa</p>
                      </div>
                      <Button
                        type="button"
                        onClick={addTestCase}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Test Case
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {soalData.testCase.map((testCase, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Test Case #{index + 1}</h3>
                            {soalData.testCase.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeTestCase(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Input
                              </label>
                              <textarea
                                value={testCase.input}
                                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                                placeholder="Input untuk test case..."
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Output yang Diharapkan
                              </label>
                              <textarea
                                value={testCase.outputDiharapkan}
                                onChange={(e) => updateTestCase(index, 'outputDiharapkan', e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                                placeholder="Output yang diharapkan..."
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
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
                      {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
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