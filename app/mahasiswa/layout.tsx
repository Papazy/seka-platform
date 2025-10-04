import { RolePraktikumProvider } from "@/contexts/RolePraktikumContext";
import Navbar from "../../components/Navbar";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <RolePraktikumProvider>
          <ViewModeProvider>{children}</ViewModeProvider>
        </RolePraktikumProvider>
      </main>
    </div>
  );
}
