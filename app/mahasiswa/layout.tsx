import Navbar from "../../components/Navbar"

export default function ClassLayout({
  children,
}: {  
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>
      {children}
    </main>
  </div>
  )
}