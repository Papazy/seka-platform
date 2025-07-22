'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

interface EditTugasData {
  judul: string;
  deskripsi: string;
  deadline: string;
  maksimalSubmit: number;
}

export default function EditTugasPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tugasData, setTugasData] = useState<EditTugasData>({
    judul: '',
    deskripsi: '',
    deadline: '',
    maksimalSubmit: 3
  });

  // Fetch tugas data
  useEffect(() => {
    const fetchTugas = async () => {
      try {
        const response = await fetch(
          `/api/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Gagal memuat data tugas');
        }

        const data = await response.json();
        
        // Check if user is asisten
        if (data.userRole !== 'asisten') {
          toast.error('Anda tidak memiliki akses untuk mengedit tugas ini');
          router.back();
          return;
        }

        // Format deadline for datetime-local input
        const deadlineDate = new Date(data.deadline);
        const formattedDeadline = deadlineDate.toISOString().slice(0, 16);

        setTugasData({
          judul: data.judul,
          deskripsi: data.deskripsi,
          deadline: formattedDeadline,
          maksimalSubmit: data.maksimalSubmit
        });

      } catch (error: any) {
        console.error('Error fetching tugas:', error);
        toast.error(error.message || 'Gagal memuat data tugas');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTugas();
    }
  }, [params, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTugasData(prev => ({
      ...prev,
      [name]: name === 'maksimalSubmit' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tugasData.judul.trim()) {
      toast.error('Judul tugas harus diisi');
      return;
    }

    if (!tugasData.deskripsi.trim()) {
      toast.error('Deskripsi tugas harus diisi');
      return;
    }

    const deadlineDate = new Date(tugasData.deadline);
    const now = new Date();
    
    if (deadlineDate <= now) {
      toast.error('Deadline harus di masa depan');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/praktikum/${params.id}/tugas/${params.tugasId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(tugasData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengupdate tugas');
      }

      toast.success('Tugas berhasil diupdate');
      router.push(`/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}`);
      
    } catch (error: any) {
      console.error('Error updating tugas:', error);
      toast.error(error.message || 'Gagal mengupdate tugas');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex text-sm items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Tugas</h1>
              <p className="text-gray-600 mt-1">Ubah informasi tugas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Perubahan pada tugas akan mempengaruhi semua mahasiswa yang sudah mengerjakan. 
                  Pastikan perubahan sudah sesuai sebelum menyimpan.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            
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
                onChange={handleInputChange}
                required
                className="text-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul tugas..."
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Tugas
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={6}
                value={tugasData.deskripsi}
                onChange={handleInputChange}
                required
                className="text-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan deskripsi tugas..."
              />
            </div>

            {/* Deadline & Maksimal Submit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={tugasData.deadline}
                  onChange={handleInputChange}
                  required
                  className="text-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="maksimalSubmit" className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maksimal Submit per Soal
                </label>
                <select
                  id="maksimalSubmit"
                  name="maksimalSubmit"
                  value={tugasData.maksimalSubmit}
                  onChange={handleInputChange}
                  className="text-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 kali</option>
                  <option value={2}>2 kali</option>
                  <option value={3}>3 kali</option>
                  <option value={5}>5 kali</option>
                  <option value={10}>10 kali</option>
                  <option value={-1}>Unlimited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}