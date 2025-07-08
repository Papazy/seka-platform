// app/admin/layout.tsx
import ProtectedLayout from '@/components/ProtectedLayout'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
  )
}