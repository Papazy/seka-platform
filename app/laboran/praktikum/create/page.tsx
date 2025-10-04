// app/laboran/praktikum/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import { validatePraktikumForm } from "@/lib/validations/praktikum";

interface FormData {
  nama: string;
  kodePraktikum: string;
  kodeMk: string;
  kelas: string;
  semester: "GANJIL" | "GENAP";
  tahun: number;
  jadwalHari: string;
  jadwalJamMasuk: string;
  jadwalJamSelesai: string;
  ruang: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreatePraktikumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    kodePraktikum: "",
    kodeMk: "",
    kelas: "",
    semester: "GANJIL",
    tahun: new Date().getFullYear(),
    jadwalHari: "",
    jadwalJamMasuk: "",
    jadwalJamSelesai: "",
    ruang: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [systemSettings, setSystemSettings] = useState<any>(null);

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch("/api/system-settings", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setSystemSettings(result.data);
        // Set default semester dan tahun dari sistem
        if (result.data) {
          setFormData(prev => ({
            ...prev,
            semester: result.data.currentSemester,
            tahun: result.data.currentYear,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "tahun" ? value || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePraktikumForm(formData);

    if (!validation.isValid) {
      toast.error("Mohon perbaiki error pada form");
      return;
    }

    setLoading(true);

    try {
      // Convert time strings to full datetime for database
      const jamMasukDate = new Date(`2000-01-01T${formData.jadwalJamMasuk}:00`);
      const jamSelesaiDate = new Date(
        `2000-01-01T${formData.jadwalJamSelesai}:00`,
      );

      const submitData = {
        ...formData,
        jadwalJamMasuk: jamMasukDate.toISOString(),
        jadwalJamSelesai: jamSelesaiDate.toISOString(),
      };

      const response = await fetch("/api/praktikum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Praktikum berhasil dibuat!");
        router.push("/laboran/praktikum");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal membuat praktikum");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat membuat praktikum");
    } finally {
      setLoading(false);
    }
  };

  const hariOptions = [
    { value: "Senin", label: "Senin" },
    { value: "Selasa", label: "Selasa" },
    { value: "Rabu", label: "Rabu" },
    { value: "Kamis", label: "Kamis" },
    { value: "Jumat", label: "Jumat" },
    { value: "Sabtu", label: "Sabtu" },
    { value: "Minggu", label: "Minggu" },
  ];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/laboran/praktikum">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Buat Praktikum Baru
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Isi form di bawah untuk membuat praktikum baru
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Dasar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Praktikum *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Praktikum Algoritma dan Pemrograman"
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
                  Kode Praktikum *
                </label>
                <input
                  type="text"
                  name="kodePraktikum"
                  value={formData.kodePraktikum}
                  onChange={handleInputChange}
                  placeholder="Contoh: PRAK001"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.kodePraktikum ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.kodePraktikum && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.kodePraktikum}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Mata Kuliah *
                </label>
                <input
                  type="text"
                  name="kodeMk"
                  value={formData.kodeMk}
                  onChange={handleInputChange}
                  placeholder="Contoh: TIF101"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.kodeMk ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.kodeMk && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.kodeMk}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas *
                </label>
                <input
                  type="text"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleInputChange}
                  placeholder="Contoh: A, B, C"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.kelas ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.kelas && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.kelas}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Semester & Year */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Semester & Tahun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
                >
                  <option value="GANJIL">Ganjil</option>
                  <option value="GENAP">Genap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun *
                </label>
                <input
                  type="number"
                  name="tahun"
                  value={formData.tahun}
                  onChange={handleInputChange}
                  min="2020"
                  max="2030"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.tahun ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.tahun && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.tahun}
                  </p>
                )}
              </div>
            </div>

            {systemSettings && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Semester dan tahun saat ini: {systemSettings.currentSemester}{" "}
                  {systemSettings.currentYear}
                </p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Jadwal Praktikum
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari *
                </label>
                <select
                  name="jadwalHari"
                  value={formData.jadwalHari}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.jadwalHari ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Hari</option>
                  {hariOptions.map(hari => (
                    <option key={hari.value} value={hari.value}>
                      {hari.label}
                    </option>
                  ))}
                </select>
                {errors.jadwalHari && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.jadwalHari}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Masuk *
                </label>
                <input
                  type="time"
                  name="jadwalJamMasuk"
                  value={formData.jadwalJamMasuk}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.jadwalJamMasuk ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.jadwalJamMasuk && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.jadwalJamMasuk}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Selesai *
                </label>
                <input
                  type="time"
                  name="jadwalJamSelesai"
                  value={formData.jadwalJamSelesai}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                    errors.jadwalJamSelesai
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.jadwalJamSelesai && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {errors.jadwalJamSelesai}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Lokasi</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruang *
              </label>
              <input
                type="text"
                name="ruang"
                value={formData.ruang}
                onChange={handleInputChange}
                placeholder="Contoh: Lab Komputer 1, R.301"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent ${
                  errors.ruang ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ruang && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.ruang}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/laboran/praktikum">
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
                  Buat Praktikum
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
