// app/api/admin/fakultas/[id]/route.ts
import { verifyToken } from '@/lib/auth'
import { UserRole } from '@/lib/enum'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: {params: Promise<{ id: string }>}
) {
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
    const fakultasId = (params.id)

    if (!nama || !kodeFakultas) {
      return NextResponse.json({ error: 'Nama dan kode fakultas wajib diisi' }, { status: 400 })
    }

    // Check if fakultas already exists (exclude current)
    const existingFakultas = await prisma.fakultas.findFirst({
      where: {
        OR: [
          { nama },
          { kodeFakultas }
        ],
        NOT: { id: fakultasId }
      }
    })

    if (existingFakultas) {
      return NextResponse.json({ error: 'Fakultas atau kode fakultas sudah exists' }, { status: 400 })
    }

    const updatedFakultas = await prisma.fakultas.update({
      where: { id: fakultasId },
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
      message: 'Fakultas berhasil diperbarui',
      fakultas: updatedFakultas
    })

  } catch (error) {
    console.error('Error updating fakultas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: {params: Promise<{ id: string }>}
) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    
    if (payload.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const fakultasId = (params.id)

    // Check if fakultas has program studi
    const programStudiCount = await prisma.programStudi.count({
      where: { idFakultas: fakultasId }
    })

    if (programStudiCount > 0) {
      return NextResponse.json({ 
        error: `Tidak dapat menghapus fakultas ini karena masih memiliki ${programStudiCount} program studi` 
      }, { status: 400 })
    }

    await prisma.fakultas.delete({
      where: { id: fakultasId }
    })

    return NextResponse.json({
      message: 'Fakultas berhasil dihapus'
    })

  } catch (error) {
    console.error('Error deleting fakultas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}