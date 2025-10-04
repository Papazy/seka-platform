// app/admin/fakultas/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import Modal from "@/components/ui/modal";
import { createFakultasColumns } from "./columns";
import { PlusIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { ProgramStudi } from "@/types/admin";
import toast from "react-hot-toast";

interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
  programStudi: ProgramStudi[];
  createdAt: string;
  updatedAt: string;
}

export default function FakultasPage() {
  const [data, setData] = useState<Fakultas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFakultas, setEditingFakultas] = useState<Fakultas | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFakultasData();
  }, []);

  const fetchFakultasData = async () => {
    try {
      const response = await fetch("/api/fakultas", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.fakultas);
      }
    } catch (error) {
      console.error("Error fetching fakultas data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFakultas(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fakultas: Fakultas) => {
    setEditingFakultas(fakultas);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus fakultas ini?")) {
      try {
        const response = await fetch(`/api/fakultas/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setData(data.filter(fakultas => fakultas.id !== id));
          toast.success("Fakultas berhasil dihapus");
        } else {
          const error = await response.json();
          toast.error(error.error);
        }
      } catch (error) {
        console.error("Error deleting fakultas:", error);
        toast.error("Gagal menghapus fakultas");
      }
    }
  };

  const handleSubmit = async (formData: {
    nama: string;
    kodeFakultas: string;
  }) => {
    setIsSubmitting(true);
    try {
      const url = editingFakultas
        ? `/api/fakultas/${editingFakultas.id}`
        : "/api/fakultas";
      const method = editingFakultas ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        if (editingFakultas) {
          setData(
            data.map(fakultas =>
              fakultas.id === editingFakultas.id ? result.fakultas : fakultas,
            ),
          );
        } else {
          setData([result.fakultas, ...data]);
        }

        setIsModalOpen(false);
        setEditingFakultas(null);
        toast.success(
          editingFakultas
            ? "Fakultas berhasil diperbarui"
            : "Fakultas berhasil ditambahkan",
        );
      } else {
        const error = await response.json();
        toast.error(error.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = createFakultasColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Fakultas</h1>
        <p className="mt-2 text-gray-600">Kelola semua fakultas di SEKA</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-500">
              Total Fakultas
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {data.length}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Data Fakultas
              </h2>
              <p className="text-sm text-gray-500">
                Kelola semua fakultas di sistem
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah Fakultas
            </button>
          </div>
        </div>

        <div className="p-6">
          {data.length > 0 ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Tidak ada fakultas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Mulai dengan menambahkan fakultas baru.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tambah Fakultas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFakultas(null);
        }}
        title={editingFakultas ? "Edit Fakultas" : "Tambah Fakultas"}
        size="md"
      >
        <FakultasForm
          fakultas={editingFakultas}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFakultas(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

// Fakultas Form Component
function FakultasForm({
  fakultas,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: {
  fakultas?: Fakultas | null;
  onSubmit: (data: { nama: string; kodeFakultas: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  const [formData, setFormData] = useState({
    nama: fakultas?.nama || "",
    kodeFakultas: fakultas?.kodeFakultas || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nama"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Fakultas
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Contoh: Fakultas Teknik"
          required
        />
      </div>

      <div>
        <label
          htmlFor="kodeFakultas"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Kode Fakultas
        </label>
        <input
          type="text"
          id="kodeFakultas"
          name="kodeFakultas"
          value={formData.kodeFakultas}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent"
          placeholder="Contoh: FT"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3ECF8E] border border-transparent rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : fakultas ? "Perbarui" : "Tambah"}
        </button>
      </div>
    </form>
  );
}
