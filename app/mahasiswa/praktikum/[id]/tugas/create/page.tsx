'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import toast from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { Check, ChevronLeft, ChevronRight, Edit, Eye, HelpCircle, Trash } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { useBahasa } from '@/hooks/useBahasa';

interface SoalData {
  id: string;
  judul: string;
  deskripsi: string;
  batasan: string;
  formatInput: string;
  formatOutput: string;
  batasanMemoriKb: number;
  batasanWaktuEksekusiMs: number;
  templateKode: string;
  bobotNilai: number;
  contohTestCase: Array<{
    contohInput: string;
    contohOutput: string;
    penjelasanInput: string;
    penjelasanOutput: string;
  }>;
  testCase: Array<{
    input: string;
    outputDiharapkan: string;
  }>;
}

export default function CreateTugasPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tugas');
  const [markdownPreview, setMarkdownPreview] = useState<{ [key: string]: boolean }>({})

    const [selectedBahasa, setSelectedBahasa] = useState<number[]>([]);
    
    const {data: bahasaList, isLoading: bahasaLoading, error: bahasaError} = useBahasa()
  
    // Select semua bahasa saat pertama
    useEffect(() => {
      if (bahasaList && bahasaList.length > 0 && selectedBahasa.length === 0) {
        setSelectedBahasa(bahasaList.map((bahasa) => bahasa.id));
      }
    }, [bahasaList, selectedBahasa.length]);
    


  const [tugasData, setTugasData] = useState({
    judul: '',
    deskripsi: `# Masukkan deskripsi tugas...`,
    deadline: '',
    maksimalSubmit: 3
  });

  const [soalList, setSoalList] = useState<SoalData[]>([]);

  const createEmptySoal = (): SoalData => ({
    id: Date.now().toString(),
    judul: '',
    deskripsi: '',
    batasan: '',
    formatInput: '',
    formatOutput: '',
    batasanMemoriKb: 256000,
    batasanWaktuEksekusiMs: 1000,
    templateKode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tulis kode Anda di sini\n    \n    return 0;\n}',
    bobotNilai: 100,
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
  });

  const togglePreview = (key: string) => {
    setMarkdownPreview(prev => ({
      ...prev,
      [key]: !prev[key]
    }))

  }

  const addSoal = () => {
    setSoalList([...soalList, createEmptySoal()]);
  };

  const removeSoal = (soalId: string) => {
    setSoalList(soalList.filter(s => s.id !== soalId));
  };

  const updateSoal = (soalId: string, field: string, value: any) => {
    setSoalList(soalList.map(soal =>
      soal.id === soalId ? { ...soal, [field]: value } : soal
    ));
  };


  const addContohTestCase = (soalId: string) => {
    setSoalList(soalList.map(soal =>
      soal.id === soalId
        ? {
          ...soal,
          contohTestCase: [...soal.contohTestCase, {
            contohInput: '',
            contohOutput: '',
            penjelasanInput: '',
            penjelasanOutput: ''
          }]
        }
        : soal
    ));
  };

  const removeContohTestCase = (soalId: string, index: number) => {
    setSoalList(soalList.map(soal => soal.id === soalId ? {
      ...soal,
      contohTestCase: soal.contohTestCase.filter((_, idx) => idx !== index)
    } : soal))
  }

  const updateContohTestCase = (soalId: string, index: number, field: string, value: string) => {
    setSoalList(soalList.map(soal =>
      soal.id === soalId
        ? {
          ...soal,
          contohTestCase: soal.contohTestCase.map((tc, i) =>
            i === index ? { ...tc, [field]: value } : tc
          )
        }
        : soal
    ));
  };

  const addTestCase = (soalId: string) => {
    setSoalList(soalList.map(soal =>
      soal.id === soalId
        ? {
          ...soal,
          testCase: [...soal.testCase, {
            input: '',
            outputDiharapkan: ''
          }]
        }
        : soal
    ));
  };

  const removeTestCase = (soalId: string, index: number) => {
    setSoalList(soalList.map(soal => soal.id === soalId ? {
      ...soal,
      testCase: soal.testCase.filter((_, i) => i !== index)
    } : soal));
  }

  const updateTestCase = (soalId: string, index: number, field: string, value: string) => {
    setSoalList(soalList.map(soal =>
      soal.id === soalId
        ? {
          ...soal,
          testCase: soal.testCase.map((tc, i) =>
            i === index ? { ...tc, [field]: value } : tc
          )
        }
        : soal
    ));
  };

  // toggle bahasa
  const handleBahasaToggle = (bahasaId: string) => {
    setSelectedBahasa(prev => {
      if (prev.includes(bahasaId)) {
        // Remove bahasa
        const newSelection = prev.filter(id => id !== bahasaId);
        
        // validasi wajib plih 1 bahasa
        if (newSelection.length === 0) {
          toast.error('Minimal harus memilih 1 bahasa pemrograman');
          return prev;
        }
        
        return newSelection;
      } else {
        // add bahasa
        return [...prev, bahasaId];
      }
    });
  };

  const handleSelectAllBahasa = () => {
    if (bahasaList) {
      setSelectedBahasa(bahasaList.map(bahasa => bahasa.id));
    }
  };

  const handleDeselectAllBahasa = () => {
    if (bahasaList && bahasaList.length > 0) {
      setSelectedBahasa([bahasaList[0].id]);
    }
  };

  const validateForm = () => {
    // Validate tugas
    if (!tugasData.judul.trim()) {
      toast.error('Judul tugas harus diisi');
      return false;
    }

    if (!tugasData.deskripsi.trim()) {
      toast.error('Deskripsi tugas harus diisi');
      return false;
    }

    const deadlineDate = new Date(tugasData.deadline);
    const now = new Date();

    if (deadlineDate <= now) {
      toast.error('Deadline harus di lebih lama dari hari ini');
      return false;
    }

    // Validate soal
    if (soalList.length === 0) {
      return true;
    }

    for (let i = 0; i < soalList.length; i++) {
      const soal = soalList[i];

      if (!soal.judul.trim()) {
        toast.error(`Soal ${i + 1}: Judul harus diisi`);
        return false;
      }

      if (!soal.deskripsi.trim()) {
        toast.error(`Soal ${i + 1}: Deskripsi harus diisi`);
        return false;
      }

      if (soal.testCase.length === 0 || !soal.testCase[0].outputDiharapkan.trim()) {
        toast.error(`Soal ${i + 1}: Minimal harus ada 1 test case`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const soalData = soalList.map(({ id, ...soal }) => soal)

    try {
      const payload = {
        tugas: {
          ...tugasData,
          selectedBahasa
        },
        soal:  soalData? soalData : []// Remove temporary id
      };

      const response = await fetch(`/api/praktikum/${params.id}/tugas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat tugas');
      }

      const result = await response.json();

      // Redirect ke halaman tugas yang baru dibuat
      router.push(`/mahasiswa/praktikum/${params.id}/tugas/${result.tugasId}`);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Gagal membuat tugas. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTugasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTugasData(prev => ({
      ...prev,
      [name]: name === 'maksimalSubmit' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-6">

        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Kembali
          </button>
          <h1 className="text-lg font-bold text-gray-900">Buat Tugas Baru</h1>

        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tugas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tugas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Info Tugas
              </button>
              <button
                onClick={() => setActiveTab('soal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'soal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Soal ({soalList.length})
              </button>
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Tugas Tab */}
          {activeTab === 'tugas' && (
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">

              {/* Judul Tugas */}
              <div>
                <label htmlFor="judul" className="block text-xs font-medium text-gray-700 mb-2">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={tugasData.judul}
                  onChange={handleTugasChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm focus:border-blue-500"
                  placeholder="Masukkan judul tugas..."
                />
              </div>

              {/* Deskripsi */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Deskripsi Tugas (Markdown)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePreview('tugasDeskripsi')}
                      className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${!markdownPreview['tugasDeskripsi']
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePreview('tugasDeskripsi')}
                      className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${markdownPreview['tugasDeskripsi']
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                  </div>
                </div>

                {/* Editor */}
                {!markdownPreview['tugasDeskripsi'] ? (
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows={15}
                    value={tugasData.deskripsi}
                    onChange={handleTugasChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm focus:border-blue-500 font-mono"
                    placeholder="Tulis deskripsi tugas dalam Markdown..."
                  />
                ) : (
                  <div className="min-h-[300px] border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto text-sm">
                    <MarkdownRenderer content={tugasData.deskripsi} />
                  </div>
                )}
                <div className="mt-2">
                  <MarkdownGuide />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Pilih Bahasa Pemrograman</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Pilih bahasa pemrograman yang diizinkan untuk tugas ini. Mahasiswa hanya bisa submit dengan bahasa yang dipilih.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllBahasa}
                    className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    ✓ Pilih Semua
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllBahasa}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    ✗ Hapus Semua
                  </button>
                </div>
              </div>

              {bahasaLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Memuat bahasa pemrograman...</span>
                </div>
              ) : bahasaError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600">Gagal memuat bahasa pemrograman</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : bahasaList && bahasaList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bahasaList.map((bahasa) => (
                    <div
                      key={bahasa.id}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedBahasa.includes(bahasa.id)
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleBahasaToggle(bahasa.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{bahasa.nama}</h3>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>Ekstensi: {bahasa.ekstensi}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Compiler: {bahasa.compiler}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Versi: {bahasa.versi}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedBahasa.includes(bahasa.id) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-600">Tidak ada bahasa pemrograman tersedia</p>
                </div>
              )}

              {selectedBahasa.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 text-sm">
                     Pilih minimal 1 bahasa pemrograman untuk tugas ini
                  </p>
                </div>
              )}

              {/* Deadline & Maksimal Submit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-xs font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="deadline"
                    name="deadline"
                    value={tugasData.deadline}
                    onChange={handleTugasChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="maksimalSubmit" className="block text-xs font-medium text-gray-700 mb-2">
                    Maksimal Submit per Soal
                  </label>
                  <select
                    id="maksimalSubmit"
                    name="maksimalSubmit"
                    value={tugasData.maksimalSubmit}
                    onChange={handleTugasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm focus:border-blue-500"
                  >
                    <option value={1}>1 kali</option>
                    <option value={2}>2 kali</option>
                    <option value={3}>3 kali</option>
                    <option value={5}>5 kali</option>
                    <option value={10}>10 kali</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Soal Tab */}
          {activeTab === 'soal' && (
            <div className="space-y-6">

              {/* Add Soal Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold">Daftar Soal</h2>
                <button
                  type="button"
                  onClick={addSoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Tambah Soal
                </button>
              </div>

              {/* Soal List */}
              {soalList.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <p className="text-gray-500 text-sm">Belum ada soal. Klik "Tambah Soal" untuk mulai membuat soal.</p>
                </div>
              ) : (
                soalList.map((soal, index) => (
                  <SoalForm
                    key={soal.id}
                    soal={soal}
                    index={index}
                    onUpdate={updateSoal}
                    onRemove={removeSoal}
                    onAddContohTestCase={addContohTestCase}
                    onUpdateContohTestCase={updateContohTestCase}
                    onAddTestCase={addTestCase}
                    onUpdateTestCase={updateTestCase}
                    togglePreview={togglePreview}
                    markdownPreview={markdownPreview}
                    removeTestCase={removeTestCase}
                    removeContohTestCase={removeContohTestCase}
                  />
                ))
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-8 text-sm">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Membuat...' : 'Buat Tugas & Soal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Soal Form Component
const SoalForm = ({
  soal,
  index,
  onUpdate,
  onRemove,
  onAddContohTestCase,
  onUpdateContohTestCase,
  onAddTestCase,
  onUpdateTestCase,
  markdownPreview,
  togglePreview,
  removeContohTestCase,
  removeTestCase
}: {
  soal: SoalData;
  index: number;
  onUpdate: (soalId: string, field: string, value: any) => void;
  onRemove: (soalId: string) => void;
  onAddContohTestCase: (soalId: string) => void;
  onUpdateContohTestCase: (soalId: string, index: number, field: string, value: string) => void;
  onAddTestCase: (soalId: string) => void;
  onUpdateTestCase: (soalId: string, index: number, field: string, value: string) => void;
  markdownPreview: { [key: string]: boolean };
  togglePreview: (key: string) => void;
  removeContohTestCase: (soalId: string, index: number) => void;
  removeTestCase: (soalId: string, index: number) => void;

}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">

      {/* Soal Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Soal {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(soal.id)}
          className="text-red-600 hover:text-red-800"
        >
          Hapus
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Judul Soal
            </label>
            <input
              type="text"
              value={soal.judul}
              onChange={(e) => onUpdate(soal.id, 'judul', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Masukkan judul soal"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Bobot Nilai
            </label>
            <input
              type="number"
              value={soal.bobotNilai}
              onChange={(e) => onUpdate(soal.id, 'bobotNilai', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              min="1"
              max="1000"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-medium text-gray-700">
              Deskripsi Soal (Markdown)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => togglePreview(`soal-${soal.id}-deskripsi`)}
                className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${!markdownPreview[`soal-${soal.id}-deskripsi`]
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => togglePreview(`soal-${soal.id}-deskripsi`)}
                className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${markdownPreview[`soal-${soal.id}-deskripsi`]
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
              >
                <Eye className="w-3 h-3" />
                Preview
              </button>
            </div>
          </div>

          {!markdownPreview[`soal-${soal.id}-deskripsi`] ? (
            <textarea
              rows={10}
              value={soal.deskripsi}
              onChange={(e) => onUpdate(soal.id, 'deskripsi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              placeholder="Tulis deskripsi soal dengan Markdown..."
            />
          ) : (
            <div className="min-h-[250px] border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto">
              <MarkdownRenderer content={soal.deskripsi} />
            </div>
          )}
        </div>

        {/* Format Input/Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Format Input
            </label>
            <textarea
              rows={3}
              value={soal.formatInput}
              onChange={(e) => onUpdate(soal.id, 'formatInput', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Jelaskan format input..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Format Output
            </label>
            <textarea
              rows={3}
              value={soal.formatOutput}
              onChange={(e) => onUpdate(soal.id, 'formatOutput', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Jelaskan format output..."
            />
          </div>
        </div>

        {/* Batasan */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Batasan & Constraints
          </label>
          <textarea
            rows={3}
            value={soal.batasan}
            onChange={(e) => onUpdate(soal.id, 'batasan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Jelaskan batasan dan constraints..."
          />
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Batas Waktu (ms)
            </label>
            <input
              type="number"
              value={soal.batasanWaktuEksekusiMs}
              onChange={(e) => onUpdate(soal.id, 'batasanWaktuEksekusiMs', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              min="100"
              max="10000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Batas Memori (KB)
            </label>
            <input
              type="number"
              value={soal.batasanMemoriKb}
              onChange={(e) => onUpdate(soal.id, 'batasanMemoriKb', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              min="64000"
              max="1024000"
            />
          </div>
        </div>

        {/* Template Kode */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Template Kode
          </label>
          <textarea
            rows={6}
            value={soal.templateKode}
            onChange={(e) => onUpdate(soal.id, 'templateKode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono text-xs"
            placeholder="Template kode awal untuk mahasiswa..."
          />
        </div>

        {/* Contoh Test Case */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-medium text-gray-700">
              Contoh Test Case
            </label>
            <button
              type="button"
              onClick={() => onAddContohTestCase(soal.id)}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            >
              Tambah Contoh
            </button>
          </div>

          {soal.contohTestCase.map((tc, tcIndex) => (
            <div key={tcIndex} className="border rounded-lg p-4 mb-4">
              <div className="w-full flex justify-end">
              <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => removeContohTestCase(soal.id, tcIndex)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Input
                  </label>
                  <textarea
                    rows={3}
                    value={tc.contohInput}
                    onChange={(e) =>
                      onUpdateContohTestCase(soal.id, tcIndex, 'contohInput', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>

                {/* Output + Tombol Hapus */}
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Output
                  </label>

                  <textarea
                    rows={3}
                    value={tc.contohOutput}
                    onChange={(e) =>
                      onUpdateContohTestCase(soal.id, tcIndex, 'contohOutput', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Test Case */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-medium text-gray-700">
              Test Case (untuk judging)
            </label>
            <button
              type="button"

              onClick={() => onAddTestCase(soal.id)}
              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
            >
              Tambah Test Case
            </button>
          </div>

          {soal.testCase.map((tc, tcIndex) => (
            <div key={tcIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
               <div className="w-full flex justify-end">
              <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => removeTestCase(soal.id, tcIndex)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Input
                  </label>
                  <textarea
                    rows={3}
                    value={tc.input}
                    onChange={(e) => onUpdateTestCase(soal.id, tcIndex, 'input', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>
                <div>

                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Expected Output
                    </label>
                  <textarea
                    rows={3}
                    value={tc.outputDiharapkan}
                    onChange={(e) => onUpdateTestCase(soal.id, tcIndex, 'outputDiharapkan', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const MarkdownGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-blue-800 font-medium text-sm focus:outline-none"
      >
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <span>Markdown Quick Guide</span>
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700">
            <div>
              <p><code>`code`</code> {'->'} inline code</p>
              <p><code>**bold**</code> {'->'} <strong>bold text</strong></p>
              <p><code>*italic*</code> {'->'} <em>italic text</em></p>
            </div>
            <div>
              <p><code>```code</code> {'->'} code blocks</p>
              <p><code># H1</code> {'->'} heading 1</p>
              <p><code>- item</code> {'->'} list</p>
            </div>
            <div>
              <p><code>$math$</code> {'->'} inline math</p>
              <p><code>$$math$$</code> {'->'} block math</p>
              <p><code>{'>'} quote</code> {'->'} blockquote</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


