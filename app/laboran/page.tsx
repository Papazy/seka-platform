// app/laboran/page.tsx
'use client'

import { useState, useEffect } from 'react'
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
  id: number
  nama: string
  kelas: string
  isActive: boolean
  laboran: {
    nama: string
  }
}

interface RecentTugas {
  id: number
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
      
      if (praktikumResponse.ok) {
        const praktikumData = await praktikumResponse.json()
        setStats(prev => ({...prev, totalPraktikum: praktikumData.data.length}))
        console.log('Praktikum Data:', praktikumData)
      }
      if (dosenResponse.ok) {
        const dosenData = await dosenResponse.json()
        setStats(prev => ({...prev, totalDosen: dosenData.data.length}))
        console.log('Dosen Data:', dosenData)
      }
      if (mahasiswaResponse.ok) {
        const mahasiswaData = await mahasiswaResponse.json()
        setStats(prev => ({...prev, totalMahasiswa: mahasiswaData.data.length}))
        console.log('Mahasiswa Data:', mahasiswaData)
      }

      // console.log('Stats:', stats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
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
  ]

  const quickActions = [
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
  ]

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
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Laboran</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang, {user?.nama}. Kelola praktikum dan peserta dari sini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
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
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Aksi cepat untuk mengelola praktikum</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className={`p-4 rounded-lg ${action.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                <div className="flex items-center">
                  <action.icon className={`w-5 h-5 ${action.textColor} mr-3`} />
                  <div>
                    <h3 className={`font-medium ${action.textColor}`}>{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}