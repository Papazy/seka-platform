// app/admin/program-studi/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
}

interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  idFakultas: number;
  fakultas: Fakultas;
  _count: {
    mahasiswa: number;
    dosen: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ColumnActionsProps {
  onEdit: (programStudi: ProgramStudi) => void;
  onDelete: (id: string) => void;
}

export const createProgramStudiColumns = ({
  onEdit,
  onDelete,
}: ColumnActionsProps): ColumnDef<ProgramStudi>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 font-medium">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "nama",
    header: "Program Studi",
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div>
          <span className="font-medium text-gray-900">{row.original.nama}</span>
          <p className="text-sm text-gray-500">
            Kode: {row.original.kodeProdi}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "fakultas",
    header: "Fakultas",
    cell: ({ row }) => (
      <div>
        <span className="text-sm font-medium text-gray-900">
          {row.original.fakultas.nama}
        </span>
        <p className="text-xs text-gray-500">
          ({row.original.fakultas.kodeFakultas})
        </p>
      </div>
    ),
  },
  // {
  //   accessorKey: '_count',
  //   header: 'Mahasiswa',
  //   cell: ({ row }) => (
  //     <div className="text-center">
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  //         {row.original._count.mahasiswa} orang
  //       </span>
  //     </div>
  //   )
  // },
  // {
  //   accessorKey: '_count',
  //   header: 'Dosen',
  //   cell: ({ row }) => (
  //     <div className="text-center">
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //         {row.original._count.dosen} orang
  //       </span>
  //     </div>
  //   )
  // },
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
