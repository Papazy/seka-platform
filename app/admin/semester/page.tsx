"use client";

import { useState } from "react";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useSemester } from "@/hooks/useAktifSemester";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

const generateAvailableSemesters = () => {
  const currentYear = new Date().getFullYear();
  const semesters: Array<{ tahun: number; semester: "GANJIL" | "GENAP" }> = [];

  for (let year = currentYear + 1; year >= currentYear - 2; year--) {
    semesters.push({ tahun: year, semester: "GANJIL" });
    semesters.push({ tahun: year, semester: "GENAP" });
  }

  return semesters;
};

export default function SemesterPage() {
  const {
    activeSemester, // data dari server
    isLoading, // loading state
    error, // error state
    setActiveSemester, // mutation function
    isUpdating, // loading state untuk mutation
  } = useSemester();

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<{
    tahun: number;
    semester: "GANJIL" | "GENAP";
  } | null>(null);

  const availableSemesters = generateAvailableSemesters();

  const handleOpenChangeModal = () => {
    setShowChangeModal(true);
  };

  const handleSelectSemester = (semester: {
    tahun: number;
    semester: "GANJIL" | "GENAP";
  }) => {
    // Check if already active
    if (
      semester.tahun === activeSemester?.tahun &&
      semester.semester === activeSemester?.semester
    ) {
      return;
    }

    setSelectedSemester(semester);
    setShowChangeModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmChange = () => {
    if (!selectedSemester) return;

    setActiveSemester(selectedSemester, {
      onSuccess: () => {
        // Close modal setelah berhasil
        setShowConfirmModal(false);
        setSelectedSemester(null);
      },
      onError: error => {
        console.error("Failed to change semester:", error);
      },
    });
  };

  const handleCancelChange = () => {
    setShowConfirmModal(false);
    setSelectedSemester(null);
  };

  const handleCloseChangeModal = () => {
    setShowChangeModal(false);
    setSelectedSemester(null);
  };

  const isCurrentlyActive = (tahun: number, semester: "GANJIL" | "GENAP") => {
    return (
      activeSemester?.tahun === tahun && activeSemester?.semester === semester
    );
  };

  //  Loading state dari React Query
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  //  Error state dari React Query
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error:{" "}
            {error instanceof Error ? error.message : "Gagal memuat data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Kelola Semester Aktif
        </h1>
        <p className="mt-2 text-gray-500">
          Kelola semester aktif di SEKA. Semester aktif akan mempengaruhi
          praktikum yang ditampilkan.
        </p>
      </div>

      {/* Active Semester Card */}
      <div className="max-w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3ECF8E] to-[#35b87d] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Semester Aktif</h2>
          </div>

          <div className="p-8">
            {activeSemester ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3ECF8E] bg-opacity-10 rounded-full mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {activeSemester.tahun}/{activeSemester.tahun + 1}
                  </h3>
                  <p className="text-xl font-medium text-gray-600">
                    Semester {activeSemester.semester}
                  </p>
                </div>

                <button
                  onClick={handleOpenChangeModal}
                  className="inline-flex text-sm items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium hover:cursor-pointer"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Ubah Semester Aktif
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Belum Ada Semester Aktif
                </h3>
                <p className="text-gray-600 mb-4">
                  Silakan pilih semester untuk diaktifkan
                </p>
                <button
                  onClick={handleOpenChangeModal}
                  className="inline-flex items-center px-6 py-3 bg-[#3ECF8E] text-white rounded-lg hover:bg-[#35b87d] transition-colors font-medium"
                >
                  Pilih Semester Aktif
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Semester Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Pilih Semester
              </h2>
              <button
                onClick={handleCloseChangeModal}
                className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {availableSemesters.map(semester => {
                  const isActive = isCurrentlyActive(
                    semester.tahun,
                    semester.semester,
                  );
                  return (
                    <button
                      key={`${semester.tahun}-${semester.semester}`}
                      onClick={() => handleSelectSemester(semester)}
                      disabled={isActive}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? "border-[#3ECF8E] bg-[#3ECF8E] bg-opacity-10 cursor-not-allowed"
                          : "border-gray-200 hover:border-[#3ECF8E] hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {semester.tahun}/{semester.tahun + 1}
                          </p>
                          <p className="text-sm text-gray-600">
                            Semester {semester.semester}
                          </p>
                        </div>
                        {isActive && (
                          <span className="px-3 py-1 bg-[#3ECF8E] text-white text-xs font-medium rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t">
              <button
                onClick={handleCloseChangeModal}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedSemester && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>

              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
                Konfirmasi Perubahan
              </h2>

              <p className="text-center text-gray-600 mb-4">
                Apakah Anda yakin ingin mengubah semester aktif ke:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-center font-semibold text-blue-900">
                  {selectedSemester.tahun}/{selectedSemester.tahun + 1}
                </p>
                <p className="text-center text-blue-700">
                  Semester {selectedSemester.semester}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Perhatian:</strong> Perubahan ini akan mempengaruhi
                  praktikum yang aktif dan ditampilkan kepada mahasiswa dan
                  dosen.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelChange}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmChange}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Mengubah...
                    </span>
                  ) : (
                    "Ya, Ubah Semester"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
