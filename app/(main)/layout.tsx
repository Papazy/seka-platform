// filepath: app/(main)/layout.tsx
import Navbar from '../../components/Navbar'
import ProtectedRoute from '../../components/ProtectedRoutes'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
    </div>
  )
}