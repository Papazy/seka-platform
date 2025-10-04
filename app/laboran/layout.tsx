// app/laboran/layout.tsx
import LaboranSidebar from "@/components/laboran/Sidebar";

export default function LaboranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex h-screen bg-gray-50">
        <LaboranSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      {/* <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      /> */}
    </div>
  );
}
