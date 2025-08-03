import {ColumnDef} from '@tanstack/react-table';
import { Laboran } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ColumnActionsProps{
  onEdit: (laboran: Laboran) => void;
  onDelete: (id: string) => void;
}


export const createLaboranColumns = ({ onEdit, onDelete }: ColumnActionsProps): ColumnDef<Laboran>[] => [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 font-medium">{row.index + 1}</span>
    )
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    cell: ({ row }) => (
        <span className="font-medium text-gray-900 text-sm">{row.original.nama}</span>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.email}</span>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {new Date(row.original.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }
]