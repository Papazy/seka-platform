// app/api/admin/fakultas/route.ts
import { verifyToken } from '@/lib/auth'
import { UserRole } from '@/lib/enum'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    
    // if (payload.role !== UserRole.ADMIN) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const fakultas = await prisma.fakultas.findMany({
      include: {
        programStudi: {
          select: {
            id: true,
            nama: true,
            kodeProdi: true
          }
        }
      },
      orderBy: { nama: 'asc' }
    })

    return NextResponse.json({
      message: 'Data fakultas berhasil diambil',
      fakultas
    })

  } catch (error) {
    console.error('Error fetching fakultas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    
    if (payload.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { nama, kodeFakultas } = await req.json()

    if (!nama || !kodeFakultas) {
      return NextResponse.json({ error: 'Nama dan kode fakultas wajib diisi' }, { status: 400 })
    }

    // Check if fakultas already exists
    const existingFakultas = await prisma.fakultas.findFirst({
      where: {
        OR: [
          { nama },
          { kodeFakultas }
        ]
      }
    })

    if (existingFakultas) {
      return NextResponse.json({ error: 'Fakultas atau kode fakultas sudah ada' }, { status: 400 })
    }

    const newFakultas = await prisma.fakultas.create({
      data: {
        nama,
        kodeFakultas
      },
      include: {
        programStudi: {
          select: {
            id: true,
            nama: true,
            kodeProdi: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Fakultas berhasil dibuat',
      fakultas: newFakultas
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating fakultas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}