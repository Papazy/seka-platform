"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TugasDetailResponse, useTugasDetail } from "@/hooks/useTugasDetail";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useRolePraktikum } from "@/contexts/RolePraktikumContext";
import SoalContent from "@/components/SoalContent";
import TugasLayout from "@/components/layouts/mahasiswa/TugasLayout";
import { PraktikumRole } from "@/lib/constants";

export default function TugasDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const praktikumId = params.id;

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "deskripsi";
  });
  const { isAsisten } = useRolePraktikum();
  // Fetch tugas detail
  const {
    data: tugas,
    isLoading,
    error,
    refetch,
  } = useTugasDetail(params.id as string, params.tugasId as string, !!user);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const role = isAsisten(praktikumId as string)
    ? PraktikumRole.ASISTEN
    : PraktikumRole.PRAKTIKAN;

  // Error state
  if (error || !tugas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">
            {error?.error || "Tugas tidak ditemukan"}
          </p>
          <div className="space-x-3">
            <button
              onClick={() => refetch()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TugasLayout
      soalCount={tugas.soal.length}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {activeTab === "deskripsi" && (
        <DeskripsiContent tugas={tugas} formatDate={formatDate} />
      )}

      {activeTab === "soal" && <SoalContent tugas={tugas} role={role} />}
    </TugasLayout>
  );
}

// Deskripsi Content Component
const DeskripsiContent = ({
  tugas,
  formatDate,
}: {
  tugas: TugasDetailResponse;
  formatDate: (date: string) => string;
}) => {
  const router = useRouter();
  console.log("Tugas", tugas);

  const totalSoal = tugas.soal.length;
  const totalBenar = tugas.soal.filter(s => s.bestScore === 100).length;
  const isSelesai = totalSoal > 0 && totalSoal === totalBenar;
  const isOverdue = new Date() > new Date(tugas.deadline);
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold ">{tugas.judul}</h2>
        {tugas.userRole === PraktikumRole.ASISTEN && (
          <Button
            onClick={() =>
              router.push(
                `/mahasiswa/praktikum/${tugas.praktikum.id}/tugas/${tugas.id}/edit`,
              )
            }
            className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
          >
            <Edit /> Edit
          </Button>
        )}
        {tugas.userRole === PraktikumRole.PRAKTIKAN && isSelesai && (
          <div className="bg-green-100 text-sm text-green-800 px-2 py-1 rounded-sm">Selesai</div>
        )}
        {tugas.userRole === PraktikumRole.PRAKTIKAN && !isSelesai && isOverdue && (
          <div className="bg-red-100 text-sm text-red-800 px-2 py-1 rounded-sm">Terlambat</div>
        )}
      </div>

      {/* Tugas Info */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Informasi Tugas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Deadline
              </span>
              <p
                className={`mt-1 ${tugas.isOverdue ? "text-red-600 font-medium" : "text-gray-900"}`}
              >
                {formatDate(tugas.deadline)}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">
                Bahasa didukung
              </span>
              <p className={`mt-1  text-gray-900`}>
                {tugas.tugasBahasa.map(tb => (
                  <span
                    key={tb.idBahasa}
                    className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2 mb-2 text-sm"
                  >
                    {tb.bahasa.nama}
                  </span>
                ))}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">
                Maksimal Submit per Soal
              </span>
              <p className="mt-1 text-gray-900">{tugas.maksimalSubmit} kali</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Dibuat oleh
              </span>
              <p className="mt-1 text-gray-900 text-sm">{tugas.pembuat.nama}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">
                Dibuat pada
              </span>
              <p className="mt-1 text-gray-900 text-sm">
                {formatDate(tugas.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats untuk Peserta */}
      {tugas.userRole === PraktikumRole.PRAKTIKAN && (
        <div className="border-t pt-6 mt-6">
          <h3 className="font-medium mb-4">Progress Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-gray-900">
                {tugas.soal.length}
              </div>
              <div className="text-sm text-gray-600">Total Soal</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.soal.filter(s => s.bestScore === 100).length}
              </div>
              <div className="text-sm text-gray-600">Total Soal Selesai</div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {
                  tugas.soal.filter(
                    s => s.submissionCount && s.submissionCount > 0,
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">
                Total Submission dikirim
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats untuk Asisten */}
      {tugas.userRole === PraktikumRole.ASISTEN && tugas.submissionStats && (
        <div className="border-t pt-6 mt-6">
          <h3 className="font-medium mb-4">Statistik Submission</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tugas.submissionStats.uniqueSubmitters}/
                {tugas.submissionStats.totalPeserta}
              </div>
              <div className="text-sm text-gray-600">Menjawab </div>
            </div>
          </div>
        </div>
      )}

      {/* Tugas Description */}
      <div className="mt-8">
        <MarkdownRenderer content={tugas.deskripsi} />
      </div>
    </div>
  );
};
