import LeftSidebar, { SidebarConfig } from "@/components/LeftSidebar";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface TugasLayoutProps {
  children: ReactNode;
  soalCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TugasLayout(props: TugasLayoutProps) {
  const pathname = usePathname();
  const params = useParams();

  const sidebarConfig: SidebarConfig = {
    title: "Menu Tugas",
    backLabel: "Kembali",
    backPath: `/mahasiswa/praktikum/${params.id}`,
    showRole: true,
    activeItemId: props.activeTab,
    onTabChange: props.onTabChange,
    menuItems: [
      {
        id: "deskripsi",
        label: "Deskripsi",
        path: `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}?tab=deskripsi`,
      },
      {
        id: "soal",
        label: `Soal (${props.soalCount})`,
        path: `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}?tab=soal`,
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
      <div className="w-4/5 bg-white p-6 rounded-lg shadow">
        {props.children}
      </div>
    </div>
  );
}
