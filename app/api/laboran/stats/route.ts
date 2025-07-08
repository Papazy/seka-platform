// app/api/laboran/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    
    // Ambil token dari cookies
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verifikasi token dan ambil informasi pengguna
    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const laboranId = payload.id

    // Fetch stats berdasarkan praktikum yang dikelola laboran
    const [
      praktikumCount,
      tugasCount,
      pesertaCount,
      asistenCount,
      mahasiswaCount,
      dosenCount
    ] = await Promise.all([
      prisma.praktikum.count(),
      prisma.tugas.count(),
      prisma.pesertaPraktikum.count(),
      prisma.asistenPraktikum.count(),
      prisma.mahasiswa.count(),
      prisma.dosen.count()
    ])

    const stats = {
      totalPraktikum: praktikumCount,
      totalTugas: tugasCount,
      totalPeserta: pesertaCount,
      totalAsisten: asistenCount,
      totalMahasiswa: mahasiswaCount,
      totalDosen: dosenCount
    }

    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error fetching laboran stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}