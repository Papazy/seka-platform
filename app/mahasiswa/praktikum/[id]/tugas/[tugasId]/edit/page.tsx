"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Calendar,
  Users,
  AlertTriangle,
  Edit,
  Eye,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useBahasa } from "@/hooks/useBahasa";
import { useTugasDetail } from "@/hooks/useTugasDetail";
import { useUpdateTugas } from "@/hooks/useUpdateTugas";
import { formatDateForInput } from "@/utils/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface EditTugasData {
  judul: string;
  deskripsi: string;
  deadline: string;
  maksimalSubmit: number;
  tugasBahasa: any;
}

export default function EditTugasPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tugasData, setTugasData] = useState<EditTugasData>({
    judul: "",
    deskripsi: "",
    deadline: "",
    maksimalSubmit: 3,
    tugasBahasa: [],
  });
  const {
    data: TugasData,
    isLoading: TugasLoading,
    error: TugasError,
  } = useTugasDetail(params.id as string, params.tugasId as string, !!user);

  const [selectedBahasa, setSelectedBahasa] = useState<string[]>([]);

  const {
    data: bahasaList,
    isLoading: bahasaLoading,
    error: bahasaError,
  } = useBahasa();

  const updateTugasMutation = useUpdateTugas();

  // Select semua bahasa saat pertama
  useEffect(() => {
    if (selectedBahasa.length === 0 && TugasData) {
      setSelectedBahasa(TugasData.tugasBahasa.map(tb => tb.bahasa.id));
    }

    if (TugasData) {
      setTugasData({
        judul: TugasData.judul,
        deskripsi: TugasData.deskripsi,
        deadline: formatDateForInput(TugasData.deadline),
        maksimalSubmit: TugasData.maksimalSubmit,
        tugasBahasa: TugasData.tugasBahasa.map(tb => ({
          id: tb.bahasa.id,
          nama: tb.bahasa.nama,
          ekstensi: tb.bahasa.ekstensi,
          compiler: tb.bahasa.compiler,
          versi: tb.bahasa.versi,
        })),
      });
      setIsLoading(false);
    }
  }, [TugasData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setTugasData(prev => ({
      ...prev,
      [name]: name === "maksimalSubmit" ? value : value,
    }));
  };

  const handleBahasaToggle = (bahasaId: string) => {
    setSelectedBahasa(prev => {
      if (prev.includes(bahasaId)) {
        // Remove bahasa
        const newSelection = prev.filter(id => id !== bahasaId);

        // validasi wajib plih 1 bahasa
        if (newSelection.length === 0) {
          toast.error("Minimal harus memilih 1 bahasa pemrograman");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tugasData.judul.trim()) {
      toast.error("Judul tugas harus diisi");
      return;
    }

    if (!tugasData.deskripsi.trim()) {
      toast.error("Deskripsi tugas harus diisi");
      return;
    }

    const deadlineDate = new Date(tugasData.deadline);
    const now = new Date();

    if (deadlineDate <= now) {
      toast.error("Deadline harus lebih dari waktu sekarang");
      return;
    }

    setIsSaving(true);

    const payload = {
      ...tugasData,
      tugasBahasa: selectedBahasa,
    };

    updateTugasMutation.mutate(
      {
        praktikumId: params.id as string,
        tugasId: params.tugasId as string,
        data: payload,
      },
      {
        onSuccess: () => {
          router.push(
            `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}`,
          );
        },
        onSettled: () => {
          setIsSaving(false);
        },
      },
    );
  };

  const loading = useDebounce(isLoading, 500);

  if (loading) {
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
                <h3 className="text-sm font-medium text-yellow-800">
                  Perhatian
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Perubahan pada tugas akan mempengaruhi semua mahasiswa yang
                  sudah mengerjakan. Pastikan perubahan sudah sesuai sebelum
                  menyimpan.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            {/* Judul Tugas */}
            <div>
              <label
                htmlFor="judul"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-medium text-gray-700">
                  Deskripsi Tugas (Markdown)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      !showPreview
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      showPreview
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              </div>
              {showPreview ? (
                <MarkdownRenderer content={tugasData.deskripsi} />
              ) : (
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
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Pilih Bahasa Pemrograman
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Pilih bahasa pemrograman yang diizinkan untuk tugas ini.
                  Mahasiswa hanya bisa submit dengan bahasa yang dipilih.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllBahasa}
                  className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllBahasa}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            </div>

            {bahasaLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">
                  Memuat bahasa pemrograman...
                </span>
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
                {bahasaList.map(bahasa => (
                  <div
                    key={bahasa.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedBahasa.includes(bahasa.id)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleBahasaToggle(bahasa.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {bahasa.nama}
                          </h3>
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
                <p className="text-yellow-600">
                  Tidak ada bahasa pemrograman tersedia
                </p>
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
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                <label
                  htmlFor="maksimalSubmit"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
