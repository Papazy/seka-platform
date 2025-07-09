'use client'

import { Button } from "@/components/ui/button"
import { AcademicCapIcon, ArrowLeftIcon, MagnifyingGlassIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline"
import { set } from "ace-builds-internal/config"
import Link from "next/link"
import { useParams } from "next/navigation"
import { use, useEffect, useState } from "react"

// interface ParticipantData {
//   asistenPraktikum:
//   pesertaPraktikum:
//   dosenPraktikum:
// }


interface PraktikumData {
  id: number
  nama: string
  kodePraktikum: string
  kodeMk: string
  kelas: string
  semester: 'GANJIL' | 'GENAP'
  tahun: number
  jadwalHari: string
  jadwalJamMasuk: string
  jadwalJamSelesai: string
  ruang: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  pesertaPraktikum: mahasiswaPraktikum[]
  asistenPraktikum: mahasiswaPraktikum[]
  dosenPraktikum: dosenPraktikum[]
  _count: {
    pesertaPraktikum: number
    asistenPraktikum: number
    dosenPraktikum: number
  }

}

interface mahasiswaPraktikum {
  id: number
  idMahasiswa: number
  mahasiswa: {
    npm: string
    nama: string
  }
}

interface dosenPraktikum {
  id: number
  idDosen: number
  dosen: {
    nama: string
    nip: string
  }

}



export default function ManageParticipantsPage() {

  const params = useParams()
  const id = params.id as string

  const [participants, setParticipants] = useState([])
  const [praktikum, setPraktikum] = useState<PraktikumData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'asisten' | 'peserta' | 'dosen'>('peserta')

  useEffect(() => {
    fetchPraktikum()
  }, [])

  const fetchPraktikum = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/praktikum/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch praktikum data')
      }

      const data = await response.json()
      console.log("Fetched praktikum data:", data)
      setPraktikum(data.data)

      const pesertaPraktikum = data.data.pesertaPraktikum.map((item: mahasiswaPraktikum) => ({
        id: item.id,
        nama: item.mahasiswa.nama,
        npm: item.mahasiswa.npm
      }))

      const asistenPraktikum = data.data.asistenPraktikum.map((item: mahasiswaPraktikum) => ({
        id: item.id,
        nama: item.mahasiswa.nama,
        npm: item.mahasiswa.npm
      }))

      const dosenPraktikum = data.data.dosenPraktikum.map((item: dosenPraktikum) => ({
        item: item.id,
        nama: item.dosen.nama,
        nip: item.dosen.nip
      }))

    } catch (error) {
      console.error("Error fetching praktikum:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabList = [
    {
      key: 'peserta',
      label: 'Peserta',
      icon: UserGroupIcon,
      count: praktikum?._count.pesertaPraktikum || 0
    },
    {
      key: 'asisten',
      label: 'Asisten',
      icon: AcademicCapIcon,
      count: praktikum?._count.asistenPraktikum || 0
    },
    {
      key: 'dosen',
      label: 'Dosen',
      icon: UserIcon,
      count: praktikum?._count.dosenPraktikum || 0
    }
  ]

  const getTabLabel = (tab: 'peserta' | 'asisten' | 'dosen') => {
    switch (tab) {
      case 'peserta':
        return 'Peserta'
      case 'asisten':
        return 'Asisten'
      case 'dosen':
        return 'Dosen'
      default:
        return ''
    }
  }

  const getTabIcon = (tab: 'peserta' | 'asisten' | 'dosen') => {
    switch (tab) {
      case 'peserta':
        return UserGroupIcon
      case 'asisten':
        return AcademicCapIcon
      case 'dosen':
        return UserIcon
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4 flex gap-2 w-full">
            <div className="h-32 flex-1 bg-gray-200 rounded"></div>
            <div className="h-32 flex-1 bg-gray-200 rounded"></div>
            <div className="h-32 flex-1 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!praktikum) {
    return (

      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Praktikum tidak ditemukan</h1>
          <Link href="/laboran/praktikum">
            <Button>Kembali ke Daftar Praktikum</Button>
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center ">
          <Link href={`/laboran/praktikum/${id}`}>
            <Button variant={'outline'} size="sm" className="mr-4">
              <ArrowLeftIcon className="h-4 w-4 " />
              Kembali
            </Button>
          </Link>
          <div className="">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Kelola Peserta Praktikum</h1>
            <div className="mt-1 text-sm text-gray-600">{praktikum.nama} - Kelas {praktikum.kelas}</div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 font-medium text-sm">Peserta</p>
              <p className="font-bold text-2xl">{praktikum._count.pesertaPraktikum}</p>
            </div>
          </div>
        </div>


        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 font-medium text-sm">Asisten</p>
              <p className="font-bold text-2xl">{praktikum._count.asistenPraktikum}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 font-medium text-sm">Dosen</p>
              <p className="font-bold text-2xl">{praktikum._count.dosenPraktikum}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Conten */}
      <div className="bg-white rounded-lg shadow-sm border ">
        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-4 px-6 text-sm font-medium text-gray-600 mb-6">
          
          {tabList.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.key === activeTab
            return(
              <button 
            className={`${isActive ? 'border-green-primary text-green-primary' : 'border-transparent text-gray-500' } border-b-2 py-4 px-2 flex gap-2 items-center hover:text-gray-700`}
            onClick={() => setActiveTab(tab.key as 'peserta' | 'asisten' | 'dosen')}
          >
            <Icon className="w-4 h-4"/>
            Peserta ({tab.count})
          </button>
            )
          })}
        </div>

        {/* Cari dan tambah */}
          <div className="flex items-center justify-between mb-6 px-6 pb-4 border-b border-gray-200">
            <div className="max-w-md flex-1">

            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-green-primary absolute  top-1/2 -translate-y-1/2 left-3"/>
              <input 
                type="text" 
                placeholder={`Cari ${getTabLabel(activeTab)}...`} 
                className=" pl-10 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent w-full"
                />
            </div>
                </div>
            <div className="Add">Add</div>
          </div>


        <div className="">Main Continet</div>

      </div>
      

    </div>
  )
}