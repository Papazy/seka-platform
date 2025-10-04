// components/ui/data-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchableColumns?: string[]; // Kolom yang bisa dicari
  showSearch?: boolean; // Opsi untuk menampilkan atau menyembunyikan search
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  searchableColumns = ["nama"], // Default search di kolom nama
  showSearch = true, // Tambahkan opsi untuk menampilkan atau menyembunyikan search
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Enhanced search function
  const handleSearch = (value: string) => {
    setGlobalFilter(value);
  };

  const clearSearch = () => {
    setGlobalFilter("");
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Search */}

      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={event => handleSearch(event.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-sm"
            />
            {globalFilter && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Info */}
          <div className="flex items-center text-sm text-gray-500">
            <span className="sm:hidden">{searchableColumns.length} kolom</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {globalFilter ? (
                      <div className="space-y-2">
                        <p>
                          Tidak ada data yang cocok dengan pencarian{" "}
                          <strong>&quot;{globalFilter}&quot;</strong>
                        </p>
                        <button
                          onClick={clearSearch}
                          className="text-[#3ECF8E] hover:text-[#2EBF7B] text-sm font-medium"
                        >
                          Hapus pencarian
                        </button>
                      </div>
                    ) : (
                      "Tidak ada data yang ditemukan."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Menampilkan {table.getFilteredRowModel().rows.length} dari{" "}
          {data.length} data
          {globalFilter && (
            <span className="ml-2 text-[#3ECF8E] font-medium">
              (hasil pencarian &quot;{globalFilter}&quot;)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex"
            title="Halaman pertama"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeftIcon className="h-4 w-4" />
            <ChevronLeftIcon className="h-4 w-4 -ml-2" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Halaman sebelumnya"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 text-sm text-gray-700 bg-gray-50 rounded-lg">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Halaman selanjutnya"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex"
            title="Halaman terakhir"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRightIcon className="h-4 w-4" />
            <ChevronRightIcon className="h-4 w-4 -ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
