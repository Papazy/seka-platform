import React, { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';

export default function LeftSidebar() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      path: `/mahasiswa/praktikum/${params.id}`
    },
    {
      id: 'rekap',
      label: 'Rekap Nilai',
      path: `/mahasiswa/praktikum/${params.id}/rekap`
    },
    {
      id: 'peserta',
      label: 'Peserta',
      path: `/mahasiswa/praktikum/${params.id}/peserta`
    }
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm w-64 flex-shrink-0">
      <div className="space-y-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-2">
          <h2 className="text-sm font-medium text-gray-900">Menu Praktikum</h2>
          <button
            onClick={() => router.replace('/mahasiswa/praktikum')}
            className="text-xs text-gray-600 hover:text-gray-900 border rounded px-1 py-1 transition-colors cursor-pointer hover:bg-gray-50"
          >
            {'<'} Kembali
          </button>
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer 
                ${isActive
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}