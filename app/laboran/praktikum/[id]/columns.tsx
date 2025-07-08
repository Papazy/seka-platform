import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";

interface MahasiswaData {
  npm: string;
  nama: string;
}

interface DosenData {
  nip: string;
  nama: string;
}

export const createMahasiswaColumns = () : ColumnDef<MahasiswaData>[] => [
  {
    header: 'NO',
    id: 'no',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: 'npm',
    header: 'NPM',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
          {row.original.npm}
      </div>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
          {row.original.nama}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* <Button variant="outline" size="sm" className="text-xs">
          <EyeIcon className="h-4 w-4" />
        </Button> */}
        <Button variant="outline" size="sm" className="text-xs">
          <PencilIcon className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <TrashIcon className="h-3 w-3" />
        </Button>
      </div>
    ),
  }
] 


export const createDosenColumns = () : ColumnDef<DosenData>[] => [
  {
    header: 'NO',
    id: 'no',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: 'nip',
    header: 'NIP',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
          {row.original.nip}
      </div>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
          {row.original.nama}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* <Button variant="outline" size="sm" className="text-xs">
          <EyeIcon className="h-4 w-4" />
        </Button> */}
        <Button variant="outline" size="sm" className="text-xs">
          <PencilIcon className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <TrashIcon className="h-3 w-3" />
        </Button>
      </div>
    ),
  }
]