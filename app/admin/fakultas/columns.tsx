// app/admin/fakultas/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ProgramStudi } from "@/types/admin";

interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
  programStudi: ProgramStudi[];
  createdAt: string;
  updatedAt: string;
}
interface ColumnActionsProps {
  onEdit: (fakultas: Fakultas) => void;
  onDelete: (id: string) => void;
}

export const createFakultasColumns = ({
  onEdit,
  onDelete,
}: ColumnActionsProps): ColumnDef<Fakultas>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 font-medium">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama Fakultas",
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div>
          <span className="font-medium text-gray-900 text-sm">
            {row.original.nama}
          </span>
          <p className="text-xs text-gray-500">
            Kode: {row.original.kodeFakultas}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "programStudi",
    header: "Program Studi",
    cell: ({ row }) => (
      <div>
        <span className="text-sm font-medium text-gray-900">
          {row.original.programStudi.length} Program Studi
        </span>
        {row.original.programStudi.length > 0 && (
          <p className="text-xs text-gray-500 mt-1 text-wrap">
            {row.original.programStudi
              .slice(0, 2)
              .map(p => p.nama)
              .join(", ")}
            {row.original.programStudi.length > 2 &&
              ` +${row.original.programStudi.length - 2} lainnya`}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {new Date(row.original.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
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
    ),
  },
];
