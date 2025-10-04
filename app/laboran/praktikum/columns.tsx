// app/laboran/praktikum/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { formatTime } from "@/utils/utils";
import Link from "next/link";

interface PraktikumData {
  id: string;
  nama: string;
  kodePraktikum: string;
  kodeMk: string;
  kelas: string;
  semester: "GANJIL" | "GENAP";
  tahun: number;
  jadwalHari: string;
  jadwalJamMasuk: string;
  jadwalJamSelesai: string;
  ruang: string;
  isActive: boolean;
  laboran: {
    id: string;
    nama: string;
    email: string;
  };
  _count: {
    pesertaPraktikum: number;
    asistenPraktikum: number;
    dosenPraktikum: number;
    tugas: number;
  };
}

interface ColumnActionsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onDetail: (id: string) => void;
}

export const createPraktikumColumns = ({
  onEdit,
  onDelete,
  onToggleActive,
  onDetail,
}: ColumnActionsProps): ColumnDef<PraktikumData>[] => [
  {
    header: "No",
    id: "no",
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "nama",
    header: "Nama Praktikum",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <button
          onClick={() => onDetail(row.original.id)}
          className="font-medium text-gray-900 hover:text-[#3ECF8E] cursor-pointer text-left"
        >
          {row.original.nama}
        </button>
        <p className="text-sm text-gray-500 mt-1">
          {row.original.kodePraktikum} • {row.original.kodeMk}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "kelas",
    header: "Kelas",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.kelas}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium text-gray-900">{row.original.semester}</p>
        <p className="text-gray-500">{row.original.tahun}</p>
      </div>
    ),
  },
  {
    accessorKey: "jadwal",
    header: "Jadwal",
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium text-gray-900">{row.original.jadwalHari}</p>
        <p className="text-gray-500">
          {formatTime(row.original.jadwalJamMasuk)} -{" "}
          {formatTime(row.original.jadwalJamSelesai)}
        </p>
        <p className="text-gray-500">{row.original.ruang}</p>
      </div>
    ),
  },
  {
    accessorKey: "participants",
    header: "Partisipan",
    cell: ({ row }) => (
      <div className="text-sm space-y-1">
        <div className="flex items-center">
          {/* <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" /> */}
          <span className="text-gray-900">
            {row.original._count.pesertaPraktikum}
          </span>
          <span className="text-gray-500 ml-1">Praktikan</span>
        </div>
        <div className="flex items-center">
          {/* <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-1" /> */}
          <span className="text-gray-900">
            {row.original._count.asistenPraktikum}
          </span>
          <span className="text-gray-500 ml-1">Asisten</span>
        </div>
        <div className="text-gray-500 text-xs">
          <span className="text-gray-900">
            {row.original._count.dosenPraktikum}
          </span>
          <span className="text-gray-500 ml-1">Dosen</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <button
          onClick={() => onToggleActive(row.original.id, row.original.isActive)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            row.original.isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-1 ${
              row.original.isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {row.original.isActive ? "Aktif" : "Nonaktif"}
        </button>
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
