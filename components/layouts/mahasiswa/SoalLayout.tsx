import LeftSidebar, { SidebarConfig } from "@/components/LeftSidebar";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface SoalLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  rightSidebar: ReactNode;
}

export default function SoalLayout(props: SoalLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const sidebarConfig: SidebarConfig = {
    title: "Menu Soal",
    backPath: `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}?tab=soal`,
    backLabel: "Kembali",
    activeItemId: props.activeTab,
    onTabChange: props.onTabChange,
    showRole: true,
    menuItems: [
      {
        id: "soal",
        label: "Soal",
        path: `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}?tab=soal`,
      },
      {
        id: "submission",
        label: "Submission",
        path: `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}?tab=submission`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex p-4 gap-4 h-screen">
        <div className="w-64 flex-shrink-0">
          {/* left */}
          <LeftSidebar config={sidebarConfig} currentPath={pathname} />
        </div>
        {/* main */}
        {props.children}

        <div className="w-96 flex-shrink-0">{props.rightSidebar}</div>
      </div>
    </div>
  );
}
