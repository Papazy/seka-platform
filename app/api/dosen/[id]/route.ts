// app/api/laboran/dosen/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const dosenId = parseInt(params.id)

    // Cek apakah dosen ada
    const dosen = await prisma.dosen.findUnique({
      where: { id: dosenId }
    })

    if (!dosen) {
      return NextResponse.json({ error: 'Dosen tidak ditemukan' }, { status: 404 })
    }

    // Hapus dosen (cascade delete akan menghapus relasi)
    await prisma.dosen.delete({
      where: { id: dosenId }
    })

    return NextResponse.json({ message: 'Dosen berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting dosen:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const dosenId = parseInt(params.id)

    const dosen = await prisma.dosen.findUnique({
      where: { id: dosenId },
      include: {
        departemen: {
          include: {
            fakultas: true
          }
        },
        _count: {
          select: {
            dosenPraktikum: true,
            tugasReviewer: true
          }
        }
      }
    })

    if (!dosen) {
      return NextResponse.json({ error: 'Dosen tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data: dosen })
  } catch (error) {
    console.error('Error fetching dosen:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}