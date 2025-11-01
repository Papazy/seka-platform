// app/laboran/mahasiswa/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

interface MahasiswaData {
  id: string;
  npm: string;
  nama: string;
  email: string;
  programStudi: {
    id: string;
    nama: string;
    kodeProdi: string;
    fakultas: {
      nama: string;
      kodeFakultas: string;
    };
  };
  _count: {
    pesertaPraktikum: number;
    asistenPraktikum: number;
  };
  createdAt: string;
}

interface ColumnActionsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDetail: (id: string) => void;
  onAssignPraktikum: (id: string) => void;
}

export const createMahasiswaColumns = ({
  onEdit,
  onDelete,
  onDetail,
  onAssignPraktikum,
}: ColumnActionsProps): ColumnDef<MahasiswaData>[] => [
  {
    header: "NO",
    id: "no",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "npm",
    header: "NPM",
    cell: ({ row }) => (
      <div>
        <button
          onClick={() => onDetail(row.original.id)}
          className="font-mono text-sm font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer"
        >
          {row.original.npm}
        </button>
      </div>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium text-gray-900">{row.original.nama}</p>
        <p className="text-xs text-gray-500">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "programStudi",
    header: "Program Studi",
    cell: ({ row }) => (
      <div className="">
        <p className="font-medium text-gray-900 text-sm">
          {row.original.programStudi.nama}
        </p>
        <p className="text-gray-500 text-xs">
          {row.original.programStudi.kodeProdi} •{" "}
          {row.original.programStudi.fakultas.kodeFakultas}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
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
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => onAssignPraktikum(row.original.id)}
          className="text-green-600 hover:text-green-700"
        >
          <PlusIcon className="h-4 w-4" />
        </Button> */}
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
    ),
  },
];
