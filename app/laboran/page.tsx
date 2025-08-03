// app/laboran/page.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpenIcon, 
  UsersIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface LaboranStats {
  totalPraktikum: number
  totalMahasiswa: number
  totalDosen: number
}

interface RecentPraktikum {
  id: string
  nama: string
  kelas: string
  isActive: boolean
  laboran: {
    nama: string
  }
}

interface RecentTugas {
  id: string
  judul: string
  deadline: string
  praktikum: {
    nama: string
  }
}

export default function LaboranDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<LaboranStats>({
    totalPraktikum: 0,
    totalMahasiswa: 0,
    totalDosen: 0,
  })
  const [recentPraktikum, setRecentPraktikum] = useState<RecentPraktikum[]>([])
  const [recentTugas, setRecentTugas] = useState<RecentTugas[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // useEffect(() => {
  //   console.log("Stats berubah:", stats)
  // }, [stats])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch recent praktikum
      const [dosenResponse, mahasiswaResponse, praktikumResponse] = await Promise.all([
        fetch('api/dosen', {credentials: 'include'}),
        fetch('api/mahasiswa', {credentials: 'include'}),
        fetch('api/praktikum', {credentials: 'include'}),
      ])

      // let totalDosen = 0
      // let totalMahasiswa = 0
      // let totalPraktikum = 0
      
      const [dosenData, mahasiswaData, praktikumData] = await Promise.all([
        dosenResponse.ok ? dosenResponse.json() : { data: []},
        mahasiswaResponse.ok ? mahasiswaResponse.json() : { data: []},
        praktikumResponse.ok ? praktikumResponse.json() : { data: []},
      ])

      setStats({
        totalPraktikum: praktikumData.data.length || 0,
        totalMahasiswa: mahasiswaData.data.length || 0,
        totalDosen: dosenData.data.length || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = useMemo(()=> [
    {
      title: 'Total Praktikum',
      value: stats.totalPraktikum,
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      href: '/laboran/praktikum'
    },
    {
      title: 'Total Mahasiswa',
      value: stats.totalMahasiswa,
      icon: UsersIcon,
      color: 'bg-green-500',
      href: '/laboran/mahasiswa'
    },
    {
      title: 'Total Dosen',
      value: stats.totalDosen,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      href: '/laboran/dosen'
    },
  ], [stats])

  const quickActions = useMemo(()=>[
    {
      title: 'Buat Praktikum',
      description: 'Buat praktikum baru untuk semester ini',
      icon: PlusIcon,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/laboran/praktikum/create'
    },
    {
      title: 'Tambah Mahasiswa',
      description: 'Daftarkan mahasiswa baru',
      icon: PlusIcon,
      color: 'bg-green-50',
      textColor: 'text-green-600',
      href: '/laboran/mahasiswa/create'
    },
    {
      title: 'Tambah Dosen',
      description: 'Daftarkan dosen pengampu',
      icon: PlusIcon,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/laboran/dosen/create'
    }
  ])

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Terlambat'
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Besok'
    if (diffDays <= 7) return `${diffDays} hari lagi`
    return `${Math.ceil(diffDays / 7)} minggu lagi`
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <HeaderSection userName={user?.nama} />

      {/* Stats Cards */}
      <StatsSection cards={statCards} />

      {/* Quick Actions */}
      <QuickActionsSection actions={quickActions} />
    </div>
  )
}

// ✅ MEMOIZED: Sub-components to prevent unnecessary re-renders
const HeaderSection = React.memo(({ userName }: { userName?: string }) => (
  <div className="mb-8">
    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Laboran</h1>
    <p className="mt-2 text-gray-600">
      Selamat datang, {userName}. Kelola praktikum dan peserta dari sini.
    </p>
  </div>
))

const StatsSection = React.memo(({ cards }: { cards: any[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
    {cards.map((card) => (
      <StatCard key={card.title} card={card} />
    ))}
  </div>
))

const StatCard = React.memo(({ card }: { card: any }) => (
  <Link href={card.href}>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${card.color} group-hover:scale-105 transition-transform duration-200`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          <div className="text-sm font-medium text-gray-500">{card.title}</div>
        </div>
      </div>
    </div>
  </Link>
))

const QuickActionsSection = React.memo(({ actions }: { actions: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      <p className="text-sm text-gray-500">Aksi cepat untuk mengelola praktikum</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <QuickActionCard key={action.title} action={action} />
      ))}
    </div>
  </div>
))

const QuickActionCard = React.memo(({ action }: { action: any }) => (
  <Link href={action.href}>
    <div className={`p-4 rounded-lg ${action.color} hover:opacity-80 transition-opacity duration-200 cursor-pointer`}>
      <div className="flex items-center">
        <action.icon className={`w-5 h-5 ${action.textColor} mr-3`} />
        <div>
          <h3 className={`font-medium ${action.textColor}`}>{action.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
        </div>
      </div>
    </div>
  </Link>
))

const DashboardSkeleton = React.memo(() => (
  <div className="p-4 lg:p-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      <div className="h-48 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
))