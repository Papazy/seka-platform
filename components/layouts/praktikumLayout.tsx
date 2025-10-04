import LeftSidebar from "@/components/LeftSidebar";
import { ReactNode } from "react";

export default function PraktikumLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex p-6 gap-6 max-w-7xl mx-auto ">
      <div className="w-1/5">
        {/* left */}
        <LeftSidebar />
      </div>
      {/* main */}
      <div className="w-4/5 bg-white p-6 rounded-lg shadow">{children}</div>
    </div>
  );
}
