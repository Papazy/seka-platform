// ts/ui/ConfirmDeleteModal.tsx
"use client";

import Modal from "./ui/modal";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini?",
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-center gap-3 mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
        <p className="text-sm text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          disabled={loading}
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </Modal>
  );
}
