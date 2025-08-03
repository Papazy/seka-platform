import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast'
import  Provider  from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SEKA | Sistem Evaluasi Kode Akademik',
    template: '%s | Sistem Evaluasi Kode Akademik'
  },
  description: 'Sistem Evaluasi Kode Akademik',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>

      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        {children}
      </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}