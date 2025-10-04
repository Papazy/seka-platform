// components/modals/ImportParticipantsModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ImportParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "peserta" | "asisten" | "dosen";
  praktikumId: string;
}

export function ImportParticipantsModal({
  isOpen,
  onClose,
  onSuccess,
  type,
  praktikumId,
}: ImportParticipantsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(
        `/api/praktikum/${praktikumId}/participants/template?type=${type}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `template_${type}_praktikum.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.error("Gagal mengunduh template");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengunduh template");
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch(
        `/api/praktikum/${praktikumId}/participants/import`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Import berhasil");
        onSuccess();
        handleClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Import gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat import");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "peserta":
        return "Import Peserta";
      case "asisten":
        return "Import Asisten";
      case "dosen":
        return "Import Dosen";
      default:
        return "Import Peserta";
    }
  };

  const getSampleFormat = () => {
    switch (type) {
      case "dosen":
        return [
          { label: "NIP", value: "196801011995031001" },
          { label: "Nama (Opsional)", value: "Dr. Ahmad" },
        ];
      default:
        return [
          { label: "NPM", value: "2108107010001" },
          { label: "Nama (Opsional)", value: "Ahmad" },
        ];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Download Template
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Unduh template CSV untuk format yang benar
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>
          </div>

          {/* Format Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Format CSV:
            </h3>
            <div className="space-y-1">
              {getSampleFormat().map((field, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <code className="bg-white px-2 py-1 rounded">
                    {field.label}
                  </code>
                  <span className="mx-2">→</span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Sistem akan otomatis mencari{" "}
              {type === "dosen" ? "dosen" : "mahasiswa"} berdasarkan{" "}
              {type === "dosen" ? "NIP" : "NPM"}
            </p>
          </div>

          {/* File Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive
                ? "border-[#3ECF8E] bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-[#3ECF8E] hover:text-[#2EBF7B] font-medium">
                  Pilih file CSV
                </span>
                <span className="text-gray-500"> atau drag & drop di sini</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {file && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  File terpilih:{" "}
                  <span className="font-medium">{file.name}</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button onClick={handleClose} variant="outline" disabled={loading}>
              Batal
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="bg-[#3ECF8E] hover:bg-[#2EBF7B] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengimport...
                </>
              ) : (
                <>
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Import CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
