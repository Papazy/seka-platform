'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'

interface PesertaData {
  id: string
  nama: string
  npm: string
  email: string
  joinedAt: string
  programStudi: {
    nama: string
    kodeProdi: string
  }
}

interface AsistenData {
  id: string
  nama: string
  npm: string
  email: string
  joinedAt: string
  programStudi: {
    nama: string
    kodeProdi: string
  }
}

interface dosenData {
  nama: string
  email: string
  role: string
  nip?: string
}

export const pesertaColumns: ColumnDef<PesertaData>[] = [
  {
    header: "No",
    id: "no",
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: 'npm',
    header: 'NPM',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.original.npm}
      </div>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.nama}</p>
        <p className="text-xs text-gray-500">{row.original.email}</p>
      </div>
    )
  },
  {
    accessorKey: 'programStudi',
    header: 'Program Studi',
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.programStudi.nama}</p>
        <p className="text-xs text-gray-500">{row.original.programStudi.kodeProdi}</p>
      </div>
    )
  },
]

export const asistenColumns: ColumnDef<AsistenData>[] = [
  {
    header: "No",
    id: "no",
    cell: ({ row }) => (
      <div className="text-center text-sm">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: 'npm',
    header: 'NPM',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.original.npm}
      </div>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.nama}</p>
        <p className="text-xs text-gray-500">{row.original.email}</p>
      </div>
    )
  },
  {
    accessorKey: 'programStudi',
    header: 'Program Studi',
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.programStudi.nama}</p>
        <p className="text-xs text-gray-500">{row.original.programStudi.kodeProdi}</p>
      </div>
    )
  },
]

export const dosenColumns: ColumnDef<dosenData>[] = [
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.original.nama}
      </div>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.original.email}
      </div>
    )
  },
]