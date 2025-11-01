import PraktikumLayout from "@/components/layouts/mahasiswa/PraktikumLayout";
import LeftSidebar from "@/components/LeftSidebar";
import { ReactNode } from "react";

export default function praktikumLayout({ children }: { children: ReactNode }) {
  return <PraktikumLayout>{children}</PraktikumLayout>;
}
