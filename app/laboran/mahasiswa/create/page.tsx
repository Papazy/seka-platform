// app/laboran/mahasiswa/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";

interface FormData {
  npm: string;
  nama: string;
  email: string;
  programStudiId: string | "";
}

interface FormErrors {
  [key: string]: string;
}

interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  fakultas: {
    id: string;
    nama: string;
    kodeFakultas: string;
  };
}

export default function CreateMahasiswaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [programStudiList, setProgramStudiList] = useState<ProgramStudi[]>([]);
  const [formData, setFormData] = useState<FormData>({
    npm: "",
    nama: "",
    email: "",
    programStudiId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchProgramStudi();
  }, []);

  const fetchProgramStudi = async () => {
    try {
      const response = await fetch("/api/program-studi", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setProgramStudiList(result.programStudi);
      } else {
        toast.error("Gagal mengambil data program studi");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengambil data program studi");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "programStudiId" ? (value ? value : "") : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.npm.trim()) {
      newErrors.npm = "NPM wajib diisi";
    } else if (!/^\d{10,15}$/.test(formData.npm)) {
      newErrors.npm = "NPM harus berupa angka dengan panjang 10-15 digit";
    }

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    } else if (formData.nama.length < 2) {
      newErrors.nama = "Nama minimal 2 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.programStudiId) {
      newErrors.programStudiId = "Program studi wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon perbaiki error pada form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/mahasiswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Mahasiswa berhasil dibuat!");
        router.push("/laboran/mahasiswa");
      } else {
        const error = await response.json();
        if (error.error?.includes("NPM") || error.error?.includes("email")) {
          if (error.error.includes("NPM")) {
            setErrors({ npm: "NPM sudah digunakan" });
          }
          if (error.error.includes("email")) {
            setErrors({ email: "Email sudah digunakan" });
          }
        }
        toast.error(error.error || "Gagal membuat mahasiswa");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat membuat mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  // Group program studi by fakultas
  const groupedProgramStudi = programStudiList.reduce(
    (acc, prodi) => {
      const fakultasNama = prodi.fakultas.nama;
      if (!acc[fakultasNama]) {
        acc[fakultasNama] = [];
      }
      acc[fakultasNama].push(prodi);
      return acc;
    },
    {} as Record<string, ProgramStudi[]>,
  );

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/laboran/mahasiswa">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Tambah Mahasiswa Baru
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Isi form di bawah untuk menambahkan mahasiswa baru
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
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Mahasiswa
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NPM *
                </label>
                <input
                  type="text"
                  name="npm"
                  value={formData.npm}
                  onChange={handleInputChange}
                  placeholder="Contoh: 2021110001"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.npm ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.npm && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.npm}
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
                  placeholder="Contoh: Ahmad Maulana"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.nama ? "border-red-500" : "border-gray-300"
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
                  placeholder="Contoh: maulana@mhs.usk.ac.id"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Akademik
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Studi *
              </label>
              <select
                name="programStudiId"
                value={formData.programStudiId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                  errors.programStudiId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Pilih Program Studi</option>
                {Object.entries(groupedProgramStudi).map(
                  ([fakultasNama, prodiList]) => (
                    <optgroup key={fakultasNama} label={fakultasNama}>
                      {prodiList.map(prodi => (
                        <option key={prodi.id} value={prodi.id}>
                          {prodi.nama}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
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
                <h3 className="text-sm font-medium text-blue-900">
                  Password Default
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Password default akan diset sebagai{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    mahasiswa123
                  </code>
                  . Mahasiswa dapat mengubah password setelah login pertama
                  kali.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/laboran/mahasiswa">
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
                  Buat Mahasiswa
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
