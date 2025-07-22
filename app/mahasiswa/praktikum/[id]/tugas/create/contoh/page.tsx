'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import { 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  HelpCircle,
  Code,
  Clock,
  HardDrive,
  Trophy
} from 'lucide-react';

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
  
  const [tugasData, setTugasData] = useState({
    judul: '',
    deskripsi: `# Tugas Programming

## Deskripsi
Tulis deskripsi tugas menggunakan **Markdown**. Anda dapat menggunakan:

- **Bold text** dan *italic text*
- \`inline code\` untuk kode singkat
- Code blocks untuk kode panjang:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}
\`\`\`

## Instruksi
1. Baca soal dengan teliti
2. Implementasikan solusi yang efisien
3. Test dengan sample input/output
4. Submit sebelum deadline

> **Catatan:** Pastikan kode Anda dapat dikompilasi dan berjalan dengan benar.

### Formula Matematika
Anda juga bisa menambahkan formula: $O(n \\log n)$ atau block math:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$`,
    deadline: '',
    maksimalSubmit: 3
  });

  const [soalList, setSoalList] = useState<SoalData[]>([]);
  const [markdownPreview, setMarkdownPreview] = useState<{[key: string]: boolean}>({});

  const createEmptySoal = (): SoalData => ({
    id: Date.now().toString(),
    judul: '',
    deskripsi: `# Problem Title

## Problem Statement
Diberikan...

## Input Format
\`\`\`
Baris pertama: integer n
Baris kedua: n integers dipisahkan spasi
\`\`\`

## Output Format
\`\`\`
Satu baris berisi hasil
\`\`\`

## Constraints
- $1 \\leq n \\leq 10^5$
- $-10^9 \\leq a_i \\leq 10^9$

## Example

### Input
\`\`\`
3
1 2 3
\`\`\`

### Output
\`\`\`
6
\`\`\`

### Explanation
$1 + 2 + 3 = 6$`,
    batasan: `- $1 \\leq n \\leq 10^5$
- $-10^9 \\leq a_i \\leq 10^9$
- Time limit: 1 second per test case`,
    formatInput: `Baris pertama: integer n
Baris kedua: n integers dipisahkan spasi`,
    formatOutput: `Satu baris berisi hasil perhitungan`,
    batasanMemoriKb: 256000,
    batasanWaktuEksekusiMs: 1000,
    templateKode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> arr(n);
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // TODO: Implement your solution here
    
    return 0;
}`,
    bobotNilai: 100,
    contohTestCase: [
      {
        contohInput: '3\n1 2 3',
        contohOutput: '6',
        penjelasanInput: 'n = 3, array = [1, 2, 3]',
        penjelasanOutput: 'Sum = 1 + 2 + 3 = 6'
      }
    ],
    testCase: [
      {
        input: '3\n1 2 3',
        outputDiharapkan: '6'
      }
    ]
  });

  // Toggle markdown preview
  const togglePreview = (key: string) => {
    setMarkdownPreview(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
      toast.error('Minimal harus ada 1 soal');
      return false;
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

      if (soal.testCase.length === 0 || !soal.testCase[0].input.trim()) {
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

    try {
      const payload = {
        tugas: tugasData,
        soal: soalList.map(({ id, ...soal }) => soal) // Remove temporary id
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
      <div className="max-w-7xl mx-auto py-6 px-6">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 text-sm border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            ← Kembali
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buat Tugas Baru</h1>
              <p className="text-gray-600 mt-1">Buat tugas baru dengan Markdown support untuk formatting yang lebih baik</p>
            </div>
          </div>
        </div>

        {/* Markdown Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-2">Markdown Quick Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700">
                <div>
                  <p><code>`code`</code> - inline code</p>
                  <p><code>**bold**</code> - <strong>bold text</strong></p>
                  <p><code>*italic*</code> - <em>italic text</em></p>
                </div>
                <div>
                  <p><code>```lang</code> - code blocks</p>
                  <p><code># H1</code> - heading 1</p>
                  <p><code>- item</code> - bullet list</p>
                </div>
                <div>
                  <p><code>$math$</code> - inline math</p>
                  <p><code>$$math$$</code> - block math</p>
                  <p><code> quote</code> - blockquote</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tugas')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tugas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Info Tugas
              </button>
              <button
                onClick={() => setActiveTab('soal')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'soal'
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
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
              
              {/* Judul Tugas */}
              <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={tugasData.judul}
                  onChange={handleTugasChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan judul tugas..."
                />
              </div>

              {/* Deskripsi dengan Markdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi Tugas (Markdown)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePreview('tugasDeskripsi')}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        !markdownPreview['tugasDeskripsi'] 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePreview('tugasDeskripsi')}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        markdownPreview['tugasDeskripsi'] 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                  </div>
                </div>

                {!markdownPreview['tugasDeskripsi'] ? (
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows={16}
                    value={tugasData.deskripsi}
                    onChange={handleTugasChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Tulis deskripsi tugas dengan Markdown..."
                  />
                ) : (
                  <div className="min-h-[400px] border border-gray-300 rounded-lg p-4 bg-white overflow-auto">
                    <MarkdownRenderer content={tugasData.deskripsi} />
                  </div>
                )}
              </div>

              {/* Deadline & Maksimal Submit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                     Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="deadline"
                    name="deadline"
                    value={tugasData.deadline}
                    onChange={handleTugasChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="maksimalSubmit" className="block text-sm font-medium text-gray-700 mb-2">
                     Maksimal Submit per Soal
                  </label>
                  <select
                    id="maksimalSubmit"
                    name="maksimalSubmit"
                    value={tugasData.maksimalSubmit}
                    onChange={handleTugasChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <h2 className="text-lg font-semibold text-gray-900">Daftar Soal</h2>
                <button
                  type="button"
                  onClick={addSoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Soal
                </button>
              </div>

              {/* Soal List */}
              {soalList.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Soal</h3>
                  <p className="text-gray-600 mb-4">Mulai dengan menambahkan soal pertama untuk tugas ini.</p>
                  <button
                    type="button"
                    onClick={addSoal}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Soal Pertama
                  </button>
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
                    markdownPreview={markdownPreview}
                    togglePreview={togglePreview}
                  />
                ))
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Buat Tugas & Soal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Soal Form Component dengan Markdown
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
  togglePreview
}: {
  soal: SoalData;
  index: number;
  onUpdate: (soalId: string, field: string, value: any) => void;
  onRemove: (soalId: string) => void;
  onAddContohTestCase: (soalId: string) => void;
  onUpdateContohTestCase: (soalId: string, index: number, field: string, value: string) => void;
  onAddTestCase: (soalId: string) => void;
  onUpdateTestCase: (soalId: string, index: number, field: string, value: string) => void;
  markdownPreview: {[key: string]: boolean};
  togglePreview: (key: string) => void;
}) => {
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      
      {/* Soal Header */}
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Soal {index + 1}
          </div>
          <input
            type="text"
            value={soal.judul}
            onChange={(e) => onUpdate(soal.id, 'judul', e.target.value)}
            className="font-semibold text-lg bg-transparent border-none focus:outline-none focus:bg-white focus:border focus:border-blue-500 rounded px-2 py-1"
            placeholder="Judul Soal..."
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Trophy className="w-4 h-4" />
            <input
              type="number"
              value={soal.bobotNilai}
              onChange={(e) => onUpdate(soal.id, 'bobotNilai', parseInt(e.target.value))}
              className="w-16 text-center border border-gray-300 rounded px-2 py-1"
              min="1"
              max="1000"
            />
            <span>pts</span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(soal.id)}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          {[
            { id: 'basic', label: 'Basic Info', icon: '📝' },
            { id: 'limits', label: 'Limits', icon: '⚡' },
            { id: 'examples', label: 'Examples', icon: '🧪' },
            { id: 'tests', label: 'Test Cases', icon: '🔍' }
          ].map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            
            {/* Deskripsi Soal */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Problem Description (Markdown)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePreview(`soal-${soal.id}-deskripsi`)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      !markdownPreview[`soal-${soal.id}-deskripsi`] 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview(`soal-${soal.id}-deskripsi`)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      markdownPreview[`soal-${soal.id}-deskripsi`] 
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
                  rows={12}
                  value={soal.deskripsi}
                  onChange={(e) => onUpdate(soal.id, 'deskripsi', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Tulis deskripsi soal dengan Markdown..."
                />
              ) : (
                <div className="min-h-[300px] border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
                  <MarkdownRenderer content={soal.deskripsi} />
                </div>
              )}
            </div>

            {/* Template Kode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                💻 Template Kode (Starter Code)
              </label>
              <textarea
                rows={8}
                value={soal.templateKode}
                onChange={(e) => onUpdate(soal.id, 'templateKode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-900 text-gray-100"
                placeholder="Template kode awal untuk mahasiswa..."
              />
            </div>
          </div>
        )}

        {/* Limits Section */}
        {activeSection === 'limits' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Limit (ms)
                </label>
                <input
                  type="number"
                  value={soal.batasanWaktuEksekusiMs}
                  onChange={(e) => onUpdate(soal.id, 'batasanWaktuEksekusiMs', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="100"
                  max="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Memory Limit (KB)
                </label>
                <input
                  type="number"
                  value={soal.batasanMemoriKb}
                  onChange={(e) => onUpdate(soal.id, 'batasanMemoriKb', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="64000"
                  max="1024000"
                />
              </div>
            </div>

            {/* Constraints */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Constraints (Markdown)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePreview(`soal-${soal.id}-batasan`)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      !markdownPreview[`soal-${soal.id}-batasan`] 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePreview(`soal-${soal.id}-batasan`)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      markdownPreview[`soal-${soal.id}-batasan`] 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              </div>

              {!markdownPreview[`soal-${soal.id}-batasan`] ? (
                <textarea
                  rows={4}
                  value={soal.batasan}
                  onChange={(e) => onUpdate(soal.id, 'batasan', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="- $1 \leq n \leq 10^5$&#10;- $-10^9 \leq a_i \leq 10^9$"
                />
              ) : (
                <div className="min-h-[100px] border border-gray-300 rounded-lg p-4 bg-red-50 overflow-auto">
                  <MarkdownRenderer content={soal.batasan} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Examples Section */}
        {activeSection === 'examples' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Sample Input/Output</h4>
              <button
                type="button"
                onClick={() => onAddContohTestCase(soal.id)}
                className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Example
              </button>
            </div>
            
            {soal.contohTestCase.map((tc, tcIndex) => (
              <div key={tcIndex} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-medium text-gray-900">Example {tcIndex + 1}</h5>
                  {soal.contohTestCase.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = soal.contohTestCase.filter((_, i) => i !== tcIndex);
                        onUpdate(soal.id, 'contohTestCase', updated);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📥 Input
                    </label>
                    <textarea
                      rows={4}
                      value={tc.contohInput}
                      onChange={(e) => onUpdateContohTestCase(soal.id, tcIndex, 'contohInput', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📤 Output
                    </label>
                    <textarea
                      rows={4}
                      value={tc.contohOutput}
                      onChange={(e) => onUpdateContohTestCase(soal.id, tcIndex, 'contohOutput', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Cases Section */}
        {activeSection === 'tests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Test Cases (Hidden)</h4>
              <button
                type="button"
                onClick={() => onAddTestCase(soal.id)}
                className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Test Case
              </button>
            </div>
            
            {soal.testCase.map((tc, tcIndex) => (
              <div key={tcIndex} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-medium text-gray-900">Test Case {tcIndex + 1}</h5>
                  {soal.testCase.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = soal.testCase.filter((_, i) => i !== tcIndex);
                        onUpdate(soal.id, 'testCase', updated);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Input
                    </label>
                    <textarea
                      rows={4}
                      value={tc.input}
                      onChange={(e) => onUpdateTestCase(soal.id, tcIndex, 'input', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Output
                    </label>
                    <textarea
                      rows={4}
                      value={tc.outputDiharapkan}
                      onChange={(e) => onUpdateTestCase(soal.id, tcIndex, 'outputDiharapkan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Markdown Renderer Component
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 text-gray-700 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 mb-4 rounded-r">
              <div className="text-blue-900 italic">
                {children}
              </div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};