import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { ColumnDef } from "@tanstack/react-table"

interface MahasiswaData {
  id: string
  npm: string
  nama: string
  programStudi: {
    nama: string
    kodeProdi: string
  }
}

interface DosenData {
  id: string
  nama: string
  nip: string
  jabatan: string

}


interface CreateColumnsProps {
  selectedIds: number[]
  handleSelectIds: (ids: number[]) => void
  onClickDelete: () => void
}

export const createMahasiswaColumns = ({
  selectedIds,
  handleSelectIds,
  onClickDelete
}: CreateColumnsProps) : ColumnDef<MahasiswaData>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox  
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(!!checked)
          if(checked) {
            const allIds = table.getRowModel().rows.map(row => row.original.id)
            handleSelectIds(allIds)
          }else{
            handleSelectIds([])

          }
        }}
        aria-label="Select all rows"  
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={selectedIds.includes(row.original.id)}
        onCheckedChange={(checked) => {
          if(checked) {
            handleSelectIds([...selectedIds, row.original.id])
          } else {
            handleSelectIds(selectedIds.filter(id => row.original.id !== id))
          }
        }}
        aria-label="Select row"
      />

    )
  },
 {
   header: 'No',
   id: 'No',
   cell: ({ row }) =>(
    <div className="text-sm font-medium-text-gray-800">
      {row.index + 1}
    </div>
   )
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
  accessorKey: 'programStudi',
  header: 'Program Studi',
  cell: ({ row }) => (
    <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
      {row.original.programStudi.nama}
    </div>
  )
 },
 {
  id: 'actions',
  header: 'Aksi',
  cell: ({ row }) => (
    <div className="flex items-center justify-center gap-2">
      <Button onClick={
        ()=>{
          handleSelectIds([row.original.id])
          onClickDelete()
        }
      } 
      variant="outline" className="text-red-600">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
 }
]

export const createDosenColumns = ({selectedIds, handleSelectIds, onClickDelete}: CreateColumnsProps) : ColumnDef<DosenData>[] => [
  //select
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox  
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(!!checked)
          if(checked) {
            const allIds = table.getRowModel().rows.map(row => row.original.id)
            handleSelectIds(allIds)
          }else{
            handleSelectIds([])

          }
        }}
        aria-label="Select all rows"  
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={selectedIds.includes(row.original.id)}
        onCheckedChange={(checked) => {
          if(checked) {
            handleSelectIds([...selectedIds, row.original.id])
          } else {
            handleSelectIds(selectedIds.filter(id => row.original.id !== id))
          }
        }}
        aria-label="Select row"
      />

    )
  },
 {
   header: 'No',
   id: 'No',
   cell: ({ row }) =>(
    <div className="text-sm font-medium-text-gray-800">
      {row.index + 1}
    </div>
   )
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
  accessorKey: 'jabatan',
  header: 'Jabatan',
  cell: ({ row }) => (
    <div className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer">
      {row.original.jabatan}
    </div>
  )
 },
 {
  id: 'actions',
  header: 'Aksi',
  cell: ({ row }) => (
    <div className="flex items-center justify-center gap-2">
      <Button 
      onClick={
        ()=>{
          handleSelectIds([row.original.id])
          onClickDelete()
        }
      } 
      variant="outline" className="text-red-600">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
 }
]