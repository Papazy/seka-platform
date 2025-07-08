// app/laboran/dosen/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'

interface DosenData {
  id: number
  nip: string
  nama: string
  email: string
  jabatan: string
  programStudi: {
    id: number
    nama: string
    kodeProdi: string
    fakultas: {
      nama: string
      kodeFakultas: string
    }
  }
  _count: {
    dosenPraktikum: number
  }
  createdAt: string
}
interface ColumnActionsProps {
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onDetail: (id: number) => void
  onAssignPraktikum: (id: number) => void
}

export const createDosenColumns = ({ onEdit, onDelete, onDetail, onAssignPraktikum }: ColumnActionsProps): ColumnDef<DosenData>[] => [
  {
    accessorKey: 'nip',
    header: 'NIP',
    cell: ({ row }) => (
      <div>
        <button
          onClick={() => onDetail(row.original.id)}
          className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer"
        >
          {row.original.nip}
        </button>
      </div>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium text-gray-900">{row.original.nama}</p>
        <p className="text-sm text-gray-500">{row.original.email}</p>
        <p className="text-xs text-gray-500">{row.original.jabatan}</p>
      </div>
    )
  },
  {
    accessorKey: 'programStudi',
    header: 'Program Studi',
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium text-gray-900">{row.original.programStudi.nama}</p>
        <p className="text-gray-500">
          {row.original.programStudi.kodeProdi} • {row.original.programStudi.fakultas.kodeFakultas}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'praktikum',
    header: 'Praktikum',
    cell: ({ row }) => (
      <div className="text-sm">
        <div className="flex items-center">
          <BookOpenIcon className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-blue-700 font-medium">{row.original._count.dosenPraktikum}</span>
          <span className="text-gray-500 ml-1">Mengajar</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Daftar',
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {formatDate(row.original.createdAt)}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDetail(row.original.id)}
          className="text-blue-600 hover:text-blue-700"
        >
          <EyeIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssignPraktikum(row.original.id)}
          className="text-green-600 hover:text-green-700"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original.id)}
          className="text-yellow-600 hover:text-yellow-700"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(row.original.id)}
          className="text-red-600 hover:text-red-700"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }
]