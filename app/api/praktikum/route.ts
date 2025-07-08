// app/api/laboran/praktikum/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { getCurrentYearAndSemester } from '@/lib/getCurrentYearAndSemester'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }



    const praktikum = await prisma.praktikum.findMany({
      include: {
        laboran: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true,
            dosenPraktikum: true,
            tugas: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // set aktif atau tidak berdasarkan tahun dan semester sekarang
    const currentData = getCurrentYearAndSemester()
    
    praktikum.forEach((p) => {
      p.isActive = p.tahun === currentData.year && p.semester === currentData.semester
    })

    return NextResponse.json({ data: praktikum })
  } catch (error) {
    console.error('Error fetching praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validasi input
    const requiredFields = ['nama', 'kodePraktikum', 'kodeMk', 'kelas', 'semester', 'tahun', 'jadwalHari', 'jadwalJamMasuk', 'jadwalJamSelesai', 'ruang']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 })
      }
    }

    // Cek apakah kode praktikum sudah ada
    const existingPraktikum = await prisma.praktikum.findUnique({
      where: { kodePraktikum: body.kodePraktikum }
    })

    if (existingPraktikum) {
      return NextResponse.json({ error: 'Kode praktikum sudah digunakan' }, { status: 400 })
    }

    // Buat praktikum baru dengan laboran yang sedang login
    const praktikum = await prisma.praktikum.create({
      data: {
        ...body,
        idLaboran: payload.id,
        jadwalJamMasuk: new Date(body.jadwalJamMasuk),
        jadwalJamSelesai: new Date(body.jadwalJamSelesai)
      },
      include: {
        laboran: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true,
            dosenPraktikum: true,
            tugas: true
          }
        }
      }
    })

    return NextResponse.json({ data: praktikum })
  } catch (error) {
    console.error('Error creating praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}