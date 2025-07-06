import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SEKA | Sistem Evaluasi Kelas Akademik',
    template: '%s | Sistem Evaluasi Kelas Akademik'
  },
  description: 'Sistem Evaluasi Kelas Akademik',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" />
      </AuthProvider>
      </body>
    </html>
  )
}