'use client'

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { AcademicCapIcon, ArrowLeftIcon, DocumentArrowUpIcon, MagnifyingGlassIcon, TrashIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline"
import { set } from "ace-builds-internal/config"
import Link from "next/link"
import { useParams } from "next/navigation"
import { use, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { createDosenColumns, createMahasiswaColumns } from "./columns"
import { AddParticipantModal } from "@/components/modals/AddParticipantModal"
import { isDeepStrictEqual } from "util"
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"
import { ImportCSVModal } from "@/components/modals/ImportCSVModal"


interface PraktikumData {
  id: string
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
  id: string
  npm: string
  nama: string
  programStudi: {
    nama: string
    kodeProdi: string
  }
}

interface dosenPraktikum {
  id: string
  nama: string
  nip: string
  jabatan: string

}



export default function ManageParticipantsPage() {

  const params = useParams()
  const id = params.id as string

  const [participants, setParticipants] = useState({
    pesertaPraktikum : [] as mahasiswaPraktikum[],
    asistenPraktikum : [] as mahasiswaPraktikum[],
    dosenPraktikum : [] as dosenPraktikum[]
  })
  const [praktikum, setPraktikum] = useState<PraktikumData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'asisten' | 'peserta' | 'dosen'>('peserta')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const [isOpenImportModal, setIsOpenImportModal] = useState(false)

  const handleSwitchTab = (tab: 'asisten' | 'peserta' | 'dosen') => {
    setActiveTab(tab)
    setSelectedIds([]) // reset
    setIsSelectedAll(false) // Reset
  }


  const handleSelectIds = (ids: number[]) => {
    setSelectedIds(ids)
    // setIsSelectedAll(ids.length === participants[getTabKey(activeTab)].length)
  }

  useEffect(() => {
    fetchPraktikum()
  }, [])
  useEffect(()=>{
    fetchParticipants()
  }, [activeTab])

  useEffect(()=>{
    console.log("data participant: ", participants)
  }, [participants])

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

    } catch (error) {
      console.error("Error fetching praktikum:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchParticipants = async () => {
    if (participants[getTabKey(activeTab)]?.length > 0) return
    try{
      const type = activeTab;
      const response = await fetch(`/api/praktikum/${id}/participants?type=${type}`);

      if(!response.ok){
        throw new Error('Gagal memuat peserta praktikum');
      }

      const result = await response.json()

      console.log('result fetching participants : ', result);

      // formatiing result

      setParticipants(prev => ({
        ...prev,
        [getTabKey(activeTab)]: result.data
      }))

    }catch(error){
      console.error("Error fetching participants:", error)
      toast.error("Gagal memuat peserta praktikum")
    }
  }

  const handleAddParticipants = async ({userIds}: { userIds: number[] }) => {
    try{
      console.log(userIds)
      const type = activeTab;
      const response = await fetch(`/api/praktikum/${id}/participants/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: userIds, 
          type
        })
      })
      const result = await response.json()
      if(!response.ok){
        throw new Error(`Gagal menambahkan ${getTabLabel(activeTab)}`)
      }

      const newParticipantsResponse = await fetch(`/api/praktikum/${id}/participants?type=${type}`);
      if(newParticipantsResponse.ok){
        const newParticipantsData = await newParticipantsResponse.json()
        setParticipants(prev => ({
          ...prev,
          [getTabKey(activeTab)]: newParticipantsData.data
        }))
      }


      toast.success(`Berhasil menambahkan ${result._count} data ${getTabLabel(activeTab)}`)
    }catch(error){
      toast.error(`Terjadi kesalahan saat menambahkan ${getTabLabel(activeTab)}`)
    }
  }

  const onClickDelete = () => {
    setIsOpenDeleteModal(true)
  }

  const handleDeleteParticipants = async () => {
    try{
      if(selectedIds.length === 0){
        toast.error('Pilih minimal satu peserta untuk dihapus')
        return
      }
      const type = activeTab;
      const response = await fetch(`/api/praktikum/${id}/participants/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedIds,
          type
        })
      })
      const result = await response.json()
      console.log('result delete participants: ', result)

      if(!response.ok){
        throw new Error(`Gagal menghapus ${getTabLabel(activeTab)}`)
      }

      setSelectedIds([]) 

      toast.success(`Berhasil menghapus ${result._count} data ${getTabLabel(activeTab)}`)

      // Refresh participants data
      await renewParticipants()
    }catch(error){
      console.error('Error: delete participants', error)
      toast.error('Terjadi kesalahan saat menghapus data')
    }
  }

  const renewParticipants = async () => {
    try{
      const type = activeTab;
      const newParticipantsResponse = await fetch(`/api/praktikum/${id}/participants?type=${type}`);
      if(newParticipantsResponse.ok){
        const newParticipantsData = await newParticipantsResponse.json()
        setParticipants(prev => ({
          ...prev,
          [getTabKey(activeTab)]: newParticipantsData.data
        }))
      } 
    }catch(error){
      console.log(error)
      toast.error('Gagal memperbarui data peserta')
    }
  }

  const handleImportSuccess = async () => {
    setIsOpenImportModal(false)
    await renewParticipants()
    toast.success('Import praktikum berhasil!')
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


  const getTabKey = (tab: 'peserta' | 'asisten' | 'dosen'): keyof typeof participants => {
    switch(tab){
      case 'peserta':
        return 'pesertaPraktikum'
      case 'asisten':
        return 'asistenPraktikum'
      case 'dosen':
        return 'dosenPraktikum'
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

  const columns = activeTab === 'dosen' ? createDosenColumns({selectedIds, handleSelectIds, onClickDelete}) : createMahasiswaColumns({selectedIds, handleSelectIds, onClickDelete})


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
              <p className="font-bold text-2xl">{participants['pesertaPraktikum'].length || praktikum._count.pesertaPraktikum}</p>
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
              <p className="font-bold text-2xl">{participants['asistenPraktikum'].length || praktikum._count.asistenPraktikum}</p>
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
              <p className="font-bold text-2xl">{participants['dosenPraktikum'].length || praktikum._count.dosenPraktikum}</p>
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
            return (
              <button
                key={tab.key}
                className={`${isActive ? 'border-green-primary text-green-primary' : 'border-transparent text-gray-500'} border-b-2 py-4 px-2 flex gap-2 items-center hover:text-gray-700`}
                onClick={() => handleSwitchTab(tab.key as 'peserta' | 'asisten' | 'dosen')}
              >
                <Icon className="w-4 h-4" />
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>

        {/* Cari dan tambah */}
        <div className="flex items-center justify-between mb-6 px-6 pb-4 border-b border-gray-200">
          <div className="w-full sm:w-96">

            <div className="relative text-sm flex">
              <MagnifyingGlassIcon className="w-5 h-5 text-green-primary absolute  top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                placeholder={`Cari ${getTabLabel(activeTab)}...`}
                className=" pl-10 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ">
            {selectedIds.length > 0 && (

              <Button 
                onClick={onClickDelete}
                variant='outline' className="text-red-600 hover:text-red-700">
              <TrashIcon className="w-4 h-4 mr-2" />
              Hapus ({selectedIds.length})
            </Button>
            )}
            <Button
              variant={"outline"} 
              onClick={()=> setIsOpenImportModal(true)}
              className="text-blue-600 text-sm hover:text-blue-700 cursor-pointer">
              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button 
              onClick={() => setIsOpenAddModal(true)}
              className="bg-green-primary text-white text-sm hover:bg-green-400 cursor-pointer transition duration-200">
              + Tambah {getTabLabel(activeTab)}
            </Button>
          </div>
        </div>


        <div className="p-6">
          {participants[getTabKey(activeTab)]?.length > 0 ? (
            <DataTable 
              columns={columns}
              data={participants[getTabKey(activeTab)]}
              showSearch={false}

            />
          ) : (
            <div className="text-gray-500 text-sm py-8 text-center w-full">
              Tidak ada {getTabLabel(activeTab)} yang ditemukan.
            </div>
          )
        }
        </div> 

      </div>

        <AddParticipantModal 
          isOpen={isOpenAddModal}
          onClose={()=> setIsOpenAddModal(false)}
          handleAddParticipants={handleAddParticipants}
          type={activeTab}
          praktikumId={praktikum.id}
        />
        <ConfirmDeleteModal
          isOpen={isOpenDeleteModal}
          onClose={() => setIsOpenDeleteModal(false)}
          onConfirm={handleDeleteParticipants}
          title={`Hapus ${getTabLabel(activeTab)}`}
          message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} data ${getTabLabel(activeTab)}?`}
        />

        <ImportCSVModal 
          isOpen={isOpenImportModal}
          onClose={() => setIsOpenImportModal(false)}
          onSuccess={handleImportSuccess}
          title={`Import ${getTabLabel(activeTab)} Praktikum`}
          endpoint={`/api/praktikum/${id}/participants/import?type=${activeTab}`}
          templateEndpoint={`/api/praktikum/${id}/participants/template?type=${activeTab}`}
          sampleData={[
            {
              npm: '1234567890',
              nama: 'Nama Mahasiswa',
              programStudi: 'Teknik Informatika',
              jabatan: 'Asisten' // hanya untuk dosen
            }
          ]}
          columns={[
            activeTab === 'dosen' ? { key: 'nip', label: 'NIP' } : { key: 'npm', label: 'NPM' },
            { key: 'nama', label: 'Mahasiswa'},
            { key: 'praktikum', label: 'Praktikum'},
            { key: 'kelas', label: 'Kelas'}
          ]}
        />

    </div>
  )
}