// app/laboran/dosen/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { createDosenColumns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  AcademicCapIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import { ImportCSVModal } from "@/components/modals/ImportCSVModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

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

interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
}

interface DosenData {
  id: string;
  nip: string;
  nama: string;
  email: string;
  jabatan: string;
  programStudi: {
    id: string;
    nama: string;
    kodeProdi: string;
    fakultas: {
      nama: string;
      kodeFakultas: string;
    };
  };
  _count: {
    dosenPraktikum: number;
  };
  createdAt: string;
}

export default function DosenPage() {
  const [data, setData] = useState<DosenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProdi, setFilterProdi] = useState<string>("");
  const [filterFakultas, setFilterFakultas] = useState<string>("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [programStudiList, setProgramStudiList] = useState<ProgramStudi[]>([]);
  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDosen();
    fetchFakultas();
    fetchProdi();
  }, []);

  const fetchDosen = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dosen", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      } else {
        toast.error("Gagal mengambil data dosen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFakultas = async () => {
    try {
      const response = await fetch("/api/fakultas", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setFakultasList(result.fakultas || []);
      }
    } catch (error) {
      console.error("Error fetching fakultas:", error);
    }
  };

  const fetchProdi = async () => {
    try {
      const response = await fetch("/api/program-studi", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setProgramStudiList(result.programStudi || []);
      }
    } catch (error) {
      console.error("Error fetching program studi: ", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/laboran/dosen/edit/${id}`);
  };

  const confirmDelete = (id: string) => {
    setIsOpenModalDelete(true);
    setSelectedDeleteId(id);
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      const response = await fetch(`/api/dosen/${selectedDeleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Dosen berhasil dihapus");
        setData(prev => prev.filter(item => item.id !== selectedDeleteId));
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menghapus dosen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat menghapus dosen");
    } finally {
      setIsOpenModalDelete(false);
      setSelectedDeleteId(null);
    }
  };

  const handleDetail = (id: string) => {
    router.push(`/laboran/dosen/${id}`);
  };

  const handleAssignPraktikum = (id: string) => {
    router.push(`/laboran/dosen/${id}/assign-praktikum`);
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    fetchDosen();
    toast.success("Import dosen berhasil!");
  };

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.programStudi.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.programStudi.fakultas.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesProdi =
      !filterProdi || item.programStudi.id.toString() === filterProdi;
    const matchesFakultas =
      !filterFakultas ||
      item.programStudi.fakultas.kodeFakultas === filterFakultas;

    return matchesSearch && matchesProdi && matchesFakultas;
  });

  const columns = createDosenColumns({
    onEdit: handleEdit,
    onDelete: confirmDelete,
    onDetail: handleDetail,
    onAssignPraktikum: handleAssignPraktikum,
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Kelola Dosen
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data dosen dan assign ke praktikum
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Link href="/laboran/dosen/create">
            <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Dosen
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Dosen</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative text-sm">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari dosen berdasarkan NIP, nama, email, jabatan, atau program studi..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 text-xs">
            <select
              value={filterFakultas}
              onChange={e => {
                setFilterFakultas(e.target.value);
                setFilterProdi("");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
            >
              <option value="">Semua Fakultas</option>
              {fakultasList.map(fakultas => (
                <option key={fakultas.id} value={fakultas.kodeFakultas}>
                  {fakultas.nama}
                </option>
              ))}
            </select>

            <select
              value={filterProdi}
              onChange={e => setFilterProdi(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
            >
              <option value="">Semua Program Studi</option>
              {programStudiList
                .filter(
                  prodi =>
                    !filterFakultas ||
                    prodi.fakultas.kodeFakultas === filterFakultas,
                )
                .map(prodi => (
                  <option key={prodi.id} value={prodi.id}>
                    {prodi.nama}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          {filteredData.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredData}
              searchPlaceholder="Cari dosen..."
              showSearch={false}
            />
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterFakultas
                  ? "Tidak ada hasil"
                  : "Belum ada dosen"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterFakultas
                  ? "Coba ubah kriteria pencarian atau filter"
                  : "Mulai dengan menambahkan dosen atau import dari CSV"}
              </p>
              {!searchTerm && !filterFakultas && (
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <Link href="/laboran/dosen/create">
                    <Button className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Tambah Dosen
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
        title="Import Dosen"
        endpoint="/api/dosen/import"
        templateEndpoint="/api/dosen/template"
        sampleData={[
          {
            nip: "123456789",
            nama: "Dr. Ahmad",
            email: "ahmad@usk.ac.id",
            jabatan: "Lektor",
            program_studi: "Informatika",
          },
          {
            nip: "123456788",
            nama: "Dr. Ismail",
            email: "ismail@usk.ac.id",
            jabatan: "Asisten Ahli",
            program_studi: "Informatika",
          },
        ]}
        columns={[
          { key: "nip", label: "NIP" },
          { key: "nama", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "jabatan", label: "Jabatan" },
          { key: "programStudi", label: "Program Studi" },
        ]}
      />

      <ConfirmDeleteModal
        isOpen={isOpenModalDelete}
        onClose={() => setIsOpenModalDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Dosen"
        message="Apakah Anda yakin ingin menghapus dosen ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
