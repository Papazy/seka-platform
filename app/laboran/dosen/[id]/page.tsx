// app/laboran/dosen/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BookOpenIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { formatDate } from "@/utils/utils";

interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  fakultas: {
    nama: string;
    kodeFakultas: string;
  };
}

interface PraktikumInfo {
  id: string;
  nama: string;
  kodePraktikum: string;
  kelas: string;
  semester: string;
  tahun: number;
}

interface DosenDetail {
  id: string;
  nip: string;
  nama: string;
  email: string;
  jabatan: string;
  programStudi: ProgramStudi;
  _count: {
    dosenPraktikum: number;
  };
  dosenPraktikum: PraktikumInfo[];
  createdAt: string;
}

export default function DosenDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [dosen, setDosen] = useState<DosenDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "praktikum">(
    "overview",
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchDosen = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dosen/${id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setDosen(result.data);
      } else {
        toast.error("Gagal mengambil data dosen");
        router.push("/laboran/dosen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengambil data");
      router.push("/laboran/dosen");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchDosen();
    }
  }, [id, fetchDosen]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/dosen/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Dosen berhasil dihapus");
        router.push("/laboran/dosen");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menghapus dosen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menghapus dosen");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dosen) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Dosen tidak ditemukan
          </h1>
          <Link href="/laboran/dosen">
            <Button>Kembali ke Daftar Dosen</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/laboran/dosen">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Detail Dosen
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Informasi lengkap dosen {dosen.nip}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href={`/laboran/dosen/edit/${id}`}>
              <Button
                variant="outline"
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/laboran/dosen/${id}/assign-praktikum`}>
              <Button
                variant="outline"
                className="text-purple-600 hover:text-purple-700"
              >
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Assign Praktikum
              </Button>
            </Link>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-[#3ECF8E] to-[#2EBF7B] rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {dosen.nama}
                </h2>
                <p className="text-gray-600 font-mono">{dosen.nip}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {dosen.jabatan}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {dosen.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  {dosen.programStudi.nama}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  {dosen.programStudi.kodeProdi} •{" "}
                  {dosen.programStudi.fakultas.kodeFakultas}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Bergabung {formatDate(dosen.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-[#3ECF8E] text-[#3ECF8E]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("praktikum")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "praktikum"
                    ? "border-[#3ECF8E] text-[#3ECF8E]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Praktikum ({dosen._count.dosenPraktikum})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Academic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informasi Akademik
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Program Studi
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {dosen.programStudi.nama}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Kode Program Studi
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {dosen.programStudi.kodeProdi}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Fakultas
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {dosen.programStudi.fakultas.nama}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Kode Fakultas
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {dosen.programStudi.fakultas.kodeFakultas}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Praktikum Tab */}
            {activeTab === "praktikum" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Praktikum yang Diampu
                  </h3>
                  <Link href={`/laboran/dosen/${id}/assign-praktikum`}>
                    <Button
                      size="sm"
                      className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
                    >
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      Assign Praktikum
                    </Button>
                  </Link>
                </div>

                {dosen.dosenPraktikum && dosen.dosenPraktikum.length > 0 ? (
                  <div className="space-y-4">
                    {dosen.dosenPraktikum.map((praktikum, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {praktikum.nama}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Kelas {praktikum.kelas} • {praktikum.semester}{" "}
                              {praktikum.tahun}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Belum mengajar praktikum
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Dosen ini belum ditugaskan mengajar praktikum
                    </p>
                    <div className="mt-4">
                      <Link href={`/laboran/dosen/${id}/assign-praktikum`}>
                        <Button
                          size="sm"
                          className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
                        >
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          Assign Praktikum
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Dosen"
        message={`Apakah Anda yakin ingin menghapus dosen ${dosen.nama} (${dosen.nip})? Data yang dihapus tidak dapat dikembalikan.`}
      />
    </div>
  );
}
