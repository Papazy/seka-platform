"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import { DataTable } from "@/components/ui/data-table";
import { pesertaColumns, asistenColumns, dosenColumns } from "./columns";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePesertaPraktikum } from "@/hooks/usePesertaPraktikum";

interface PesertaData {
  praktikum: {
    id: string;
    nama: string;
    kodePraktikum: string;
    kelas: string;
  };
  dosen: Array<{ nama: string; nip: string; email: string }>;
  asisten: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
  }>;
  peserta: Array<{
    id: string;
    nama: string;
    npm: string;
    email: string;
    joinedAt: string;
    programStudi: {
      nama: string;
      kodeProdi: string;
    };
    stats: {
      totalTugasSelesai: number;
      totalTugas: number;
      rataRataNilai: number;
    };
  }>;
  userRole: "peserta" | "asisten";
}

export default function PesertaPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "pengampu" | "asisten" | "peserta"
  >("peserta");

  const {
    data: pesertaData,
    isLoading,
    isError,
    refetch,
  } = usePesertaPraktikum(params.id as string, !!user);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );

  if (!pesertaData)
    return (
      <div className="">
        <div className="p-6">Data not found</div>
      </div>
    );

  return (
    <div className="">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Daftar Peserta</h1>
            <p className="text-sm text-gray-600">
              {pesertaData.praktikum.nama} - Kelas {pesertaData.praktikum.kelas}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded"
            >
              Kembali
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Peserta</div>
            <div className="text-lg font-semibold">
              {pesertaData.peserta.length}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Asisten</div>
            <div className="text-lg font-semibold">
              {pesertaData.asisten.length}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Anggota</div>
            <div className="text-lg font-semibold">
              {pesertaData.peserta.length + pesertaData.asisten.length}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Dosen Pengampu</div>
            <div className="text-lg font-semibold">
              {pesertaData.dosen.length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: "peserta",
                label: `Peserta (${pesertaData.peserta.length})`,
              },
              {
                id: "asisten",
                label: `Asisten (${pesertaData.asisten.length})`,
              },
              {
                id: "pengampu",
                label: `Pengampu (${pesertaData.dosen.length})`,
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "pengampu" && (
            <DataTable
              columns={dosenColumns}
              data={pesertaData.dosen}
              searchPlaceholder="Cari pengampu..."
            />
          )}

          {activeTab === "asisten" && (
            <DataTable
              columns={asistenColumns}
              data={pesertaData.asisten}
              searchPlaceholder="Cari asisten..."
            />
          )}

          {activeTab === "peserta" && (
            <DataTable
              columns={pesertaColumns}
              data={pesertaData.peserta}
              searchPlaceholder="Cari peserta..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
