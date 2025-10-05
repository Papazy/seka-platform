// app/laboran/praktikum/[id]/manage-participants/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ParticipantData {
  id: string;
  type: "peserta" | "asisten" | "dosen";
  nama: string;
  identifier: string; // npm/nip
  email: string;
  joinedAt: string;
  programStudi?: {
    nama: string;
    kodeProdi: string;
  };
  jabatan?: string;
}

interface CreateColumnsProps {
  type: "peserta" | "asisten" | "dosen";
  onRemove: (participant: ParticipantData) => void;
  onChangeRole?: (
    participantId: string,
    newRole: "peserta" | "asisten",
  ) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function createParticipantColumns({
  type,
  onRemove,
  onChangeRole,
  selectedIds,
  onSelectionChange,
}: CreateColumnsProps): ColumnDef<ParticipantData>[] {
  const handleSelectAll = (checked: boolean) => {
    // This will be handled by the table component
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const baseColumns: ColumnDef<ParticipantData>[] = [
    // Selection column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table
                .getRowModel()
                .rows.map(row => row.original.id);
              onSelectionChange(allIds);
            } else {
              onSelectionChange([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={value => handleSelectOne(row.original.id, !!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Identifier column (NPM/NIP)
    {
      accessorKey: "identifier",
      header: type === "dosen" ? "NIP" : "NPM",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.identifier}</div>
      ),
    },

    // Name column
    {
      accessorKey: "nama",
      header: "Nama",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.nama}</p>
          <p className="text-sm text-gray-500">{row.original.email}</p>
        </div>
      ),
    },
  ];

  // Add program studi column for mahasiswa
  if (type !== "dosen") {
    baseColumns.push({
      accessorKey: "programStudi",
      header: "Program Studi",
      cell: ({ row }) =>
        row.original.programStudi ? (
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {row.original.programStudi.nama}
            </p>
            <p className="text-gray-500">
              {row.original.programStudi.kodeProdi}
            </p>
          </div>
        ) : (
          "-"
        ),
    });
  }

  // Add jabatan column for dosen
  if (type === "dosen") {
    baseColumns.push({
      accessorKey: "jabatan",
      header: "Jabatan",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {row.original.jabatan}
        </span>
      ),
    });
  }

  // Add joined date column
  baseColumns.push({
    accessorKey: "joinedAt",
    header: "Bergabung",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {formatDate(row.original.joinedAt)}
      </div>
    ),
  });

  // Add actions column
  baseColumns.push({
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {/* Change role button (only for mahasiswa) */}
        {type !== "dosen" && onChangeRole && (
          <Button
            onClick={() => {
              const newRole = type === "peserta" ? "asisten" : "peserta";
              onChangeRole(row.original.id, newRole);
            }}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            {type === "peserta" ? "Jadikan Asisten" : "Jadikan Peserta"}
          </Button>
        )}

        {/* Remove button */}
        <Button
          onClick={() => onRemove(row.original)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <TrashIcon className="h-3 w-3" />
        </Button>
      </div>
    ),
  });

  return baseColumns;
}
