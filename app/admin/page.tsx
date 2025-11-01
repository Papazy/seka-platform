// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";

import Link from "next/link";

interface DashboardStats {
  totalLaboran: number;
  totalFakultas: number;
  totalProgramStudi: number;
  totalMahasiswa: number;
  totalDosen: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLaboran: 0,
    totalFakultas: 0,
    totalProgramStudi: 0,
    totalMahasiswa: 0,
    totalDosen: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [laboranRes, fakultasRes, prodiRes] = await Promise.all([
        fetch("/api/laboran", { credentials: "include" }),
        fetch("/api/fakultas", { credentials: "include" }),
        fetch("/api/program-studi", { credentials: "include" }),
      ]);

      const [laboranData, fakultasData, prodiData] = await Promise.all([
        laboranRes.json(),
        fakultasRes.json(),
        prodiRes.json(),
      ]);

      // Hitung total mahasiswa dan dosen dari semua program studi
      const totalMahasiswa =
        prodiData.programStudi?.reduce(
          (sum: number, prodi: { _count: { mahasiswa: number } }) =>
            sum + (prodi._count?.mahasiswa || 0),
          0,
        ) || 0;
      const totalDosen =
        prodiData.programStudi?.reduce(
          (sum: number, prodi: { _count: { dosen: number } }) =>
            sum + (prodi._count?.dosen || 0),
          0,
        ) || 0;

      setStats({
        totalLaboran: laboranData.laboran?.length || 0,
        totalFakultas: fakultasData.fakultas?.length || 0,
        totalProgramStudi: prodiData.programStudi?.length || 0,
        totalMahasiswa,
        totalDosen,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Laboran",
      value: stats.totalLaboran,
      icon: UsersIcon,
      color: "bg-green-primary",
      bgColor: "bg-green-primary",
      textColor: "text-green-600",
      href: "/admin/laboran",
    },
    {
      title: "Total Fakultas",
      value: stats.totalFakultas,
      icon: BuildingOfficeIcon,
      color: "bg-green-primary",
      bgColor: "bg-green-primary",
      textColor: "text-green-600",
      href: "/admin/fakultas",
    },
    {
      title: "Total Program Studi",
      value: stats.totalProgramStudi,
      icon: AcademicCapIcon,
      color: "bg-green-primary",
      bgColor: "bg-green-primary",
      textColor: "text-purple-600",
      href: "/admin/program-studi",
    },
  ];

  const quickActions = [
    {
      title: "Tambah Laboran",
      description: "Tambah laboran baru ke sistem",
      icon: PlusIcon,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      href: "/admin/laboran",
    },
    {
      title: "Tambah Fakultas",
      description: "Buat fakultas baru",
      icon: PlusIcon,
      color: "bg-green-50",
      textColor: "text-green-600",
      href: "/admin/fakultas",
    },
    {
      title: "Tambah Program Studi",
      description: "Buat program studi baru",
      icon: PlusIcon,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      href: "/admin/program-studi",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang, {user?.nama}. Kelola sistem SEKA dari sini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-12 md:grid-cols-6 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map(card => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {card.title}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link key={action.title} href={action.href}>
              <div
                className={`p-4 rounded-lg ${action.color} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <div className="flex items-center">
                  <action.icon className={`w-5 h-5 ${action.textColor} mr-3`} />
                  <div>
                    <h3 className={`font-medium ${action.textColor}`}>
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
