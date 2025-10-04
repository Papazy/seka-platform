// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createLaboranColumns } from "@/app/admin/columns";
import { Laboran } from "@/types";
import toast from "react-hot-toast";
import Modal from "@/components/ui/modal";
import LaboranForm from "@/components/forms/LaboranForm";
import { PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function AdminDashboard() {
  const [data, setData] = useState<Laboran[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaboran, setSelectedLaboran] = useState<Laboran | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/laboran", {
        credentials: "include",
      });

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData.laboran);
        console.log("Dashboard data:", dashboardData.laboran);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    nama: string;
    email: string;
    password?: string;
  }) => {
    const method = isEditing ? "PUT" : "POST";
    setLoading(true);

    try {
      const response = await fetch("/api/laboran", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          id: isEditing ? selectedLaboran?.id : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Gagal menyimpan laboran");
        return;
      }

      const result = await response.json();
      if (isEditing) {
        setData(
          data.map(laboran =>
            laboran.id === selectedLaboran?.id ? result.laboran : laboran,
          ),
        );
      } else {
        setData([result.laboran, ...data]);
      }

      toast.success(
        isEditing
          ? "Laboran berhasil diperbarui"
          : "Laboran berhasil ditambahkan",
      );
    } catch (error) {
      console.error("Error saving laboran:", error);
      toast.error("Terjadi kesalahan saat menyimpan laboran");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSelectedLaboran(null);
      setIsEditing(false);
      fetchDashboardData(); // Refresh data after submit
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedLaboran(null);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const confirmDelete = (id: string) => {
    setIsModalDeleteOpen(true);
    setSelectedIdToDelete(id);
    // setSelectedLaboran(laboran)
    // setIsEditing(true)
    // setIsModalOpen(true)
  };

  const handleEdit = (laboran: Laboran) => {
    setSelectedLaboran(laboran);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsSubmitting(true);
    const id = selectedIdToDelete;
    try {
      if (!id) {
        toast.error("ID laboran tidak ditemukan");
        setIsSubmitting(false);
        return;
      }

      toast.promise(
        fetch(`/api/laboran`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }).then(res => {
          if (!res.ok) throw new Error("Gagal menghapus laboran");
          const updatedData = data.filter(laboran => laboran.id !== id);
          setData(updatedData);
          return res.json();
        }),
        {
          loading: "Menghapus laboran...",
          success: "Laboran berhasil dihapus!",
          error: err => err.message || "Terjadi kesalahan",
        },
      );
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan saat menghapus laboran");
    } finally {
      setIsSubmitting(false);
      setIsModalDeleteOpen(false);
      setSelectedIdToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen w-full">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = createLaboranColumns({
    onEdit: handleEdit,
    onDelete: confirmDelete,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Kelola Laboran di SEKA.</p>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#3ECF8E] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-[#ffffff]" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Total Laboran
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
                    Data Laboran
                  </h2>
                  <p className="text-sm text-gray-500">
                    Kelola semua laboran di sistem
                  </p>
                </div>
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Tambah Laboran
                </button>
              </div>
            </div>

            <div className="p-6">
              {data.length > 0 ? (
                <DataTable columns={columns} data={data} />
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Tidak ada laboran
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Mulai dengan menambahkan laboran baru.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAdd}
                      className="inline-flex items-center px-4 py-2 bg-[#3ECF8E] text-white text-sm font-medium rounded-lg hover:bg-[#2EBF7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Tambah Laboran
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
          // setSelectedLaboran(null)
        }}
        title={selectedLaboran ? "Edit Laboran" : "Tambah Laboran"}
        size="md"
      >
        <LaboranForm
          laboran={selectedLaboran ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLaboran(null);
          }}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus laboran ini?"
        isLoading={isSubmitting}
      />
    </div>
  );
}
