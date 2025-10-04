"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import { usePraktikumDetail } from "@/hooks/usePraktikumDetail";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import TugasCard from "@/components/TugasCard";

// ✅ Keep existing interface
interface PraktikumDetail {
  id: string;
  nama: string;
  kodePraktikum: string;
  kodeMk: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  jamMulai: string;
  jamSelesai: string;
  ruang: string;
  userRole: "peserta" | "asisten";
  instructor: {
    laboran: { nama: string; email: string };
    dosen: Array<{ nama: string; nip: string; email: string }>;
  };
  peserta: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
  }>;
  asisten: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
  }>;
  tugas: Array<{
    id: string;
    judul: string;
    deskripsi: string;
    deadline: string;
    maksimalSubmit: number;
    createdAt: string;
    pembuat: string;
    totalSoal: number;
    totalBobot: number;
    nilai?: {
      totalNilai: number;
      submittedAt: string;
    } | null;
    submissionCount: number;
    status?: "submitted" | "not_submitted" | null;
  }>;
  stats: {
    totalPeserta: number;
    totalAsisten: number;
    totalTugas: number;
    completedTasks: number;
  };
}

export default function PraktikumDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();

  const {
    data: praktikumData,
    isLoading: praktikumLoading,
    error: praktikumError,
    refetch: refetchPraktikum,
  } = usePraktikumDetail(params.id as string, !!user);

  if (praktikumLoading || isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );

  if (!praktikumData) return <div className="p-6">Data not found</div>;

  return (
    <div className="">
      {/* Header */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Kiri */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              {praktikumData.nama}
            </h1>
            <p className="text-sm text-gray-600 mb-1">
              Kelas {praktikumData.kelas}
            </p>

            {praktikumData.asisten.length > 0 && (
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Asisten:</span>{" "}
                {praktikumData.asisten.map((a, i) => (
                  <span key={a.id}>
                    {a.nama}
                    {i < praktikumData.asisten.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
          </div>

          {/* Kanan */}
          <div className="text-sm text-gray-600 text-right space-y-1">
            <div>
              {praktikumData.semester} {praktikumData.tahun}
            </div>
            <div>
              {praktikumData.jadwalHari}, {praktikumData.jamMulai} -{" "}
              {praktikumData.jamSelesai}
            </div>
            <div>Ruang {praktikumData.ruang}</div>
          </div>
        </div>
      </div>

      {/* Tugas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold ">Daftar Tugas</h2>
          {praktikumData.userRole === "asisten" && (
            <Button
              variant="default"
              onClick={() =>
                router.push(
                  `/mahasiswa/praktikum/${praktikumData.id}/tugas/create `,
                )
              }
              className="text-sm text-white bg-green-primary hover:bg-green-600 cursor-pointer"
            >
              + Tugas Baru
            </Button>
          )}
        </div>

        {praktikumData.tugas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada tugas</div>
        ) : (
          <div className="space-y-4">
            {praktikumData.tugas.map(tugas => (
              <TugasCard
                key={tugas.id}
                tugas={tugas}
                praktikumId={praktikumData.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
