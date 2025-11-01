"use client";
import { ReactNode } from "react";
import LeftSidebar, { SidebarConfig } from "../../LeftSidebar";
import { useParams, usePathname } from "next/navigation";

export default function PraktikumLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();

  const sidebarConfig: SidebarConfig = {
    title: "Menu Praktikum",
    backPath: "/mahasiswa/praktikum",
    backLabel: "Kembali",
    showRole: true,
    menuItems: [
      {
        id: "beranda",
        label: "Beranda",
        path: `/mahasiswa/praktikum/${params.id}`,
      },
      {
        id: "rekap",
        label: "Rekap Nilai",
        path: `/mahasiswa/praktikum/${params.id}/rekap`,
      },
      {
        id: "peserta",
        label: "Peserta",
        path: `/mahasiswa/praktikum/${params.id}/peserta`,
      },
    ],
  };

  return (
    <div className="flex p-6 gap-6 max-w-7xl mx-auto ">
      <div className="w-1/5">
        {/* left */}
        <LeftSidebar config={sidebarConfig} currentPath={pathname} />
      </div>
      {/* main */}
      <div className="w-4/5 bg-white p-6 rounded-lg shadow">{children}</div>
    </div>
  );
}
