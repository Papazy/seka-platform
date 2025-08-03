// app/api/laboran/praktikum/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { validatePraktikumForm } from '@/lib/validations/praktikum'

export async function DELETE(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }>}
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

    const praktikumId = (params.id)

    // Cek apakah praktikum ada
    const praktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId }
    })

    if (!praktikum) {
      return NextResponse.json({ error: 'Praktikum tidak ditemukan' }, { status: 404 })
    }

    // Hapus praktikum (cascade delete akan menghapus relasi)
    await prisma.praktikum.delete({
      where: { id: praktikumId }
    })

    return NextResponse.json({ message: 'Praktikum berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }>}
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

    const praktikumId = (params.id)

    const praktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId },
      include: {
        laboran: {
          select: {
            id: true,
            nama: true,
            email: true
          },
        },
        pesertaPraktikum: {
          include: {
            mahasiswa: {
              select: {
                nama : true,
                npm: true,
              }
            }
          }
        },
        asistenPraktikum: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              }
            }
          }
        },
        dosenPraktikum : {
          include : {
            dosen: {
              select: {
                nama: true,
                nip: true,
              }
            }
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

    if (!praktikum) {
      return NextResponse.json({ error: 'Praktikum tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data: praktikum })
  } catch (error) {
    console.error('Error fetching praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }>}
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

    const praktikumId = (params.id)
    const body = await request.json()
    
    // Validasi input
    const requiredFields = [
      'nama', 'kodePraktikum', 'kodeMk', 'kelas', 'semester', 'tahun',
      'jadwalHari', 'jadwalJamMasuk', 'jadwalJamSelesai', 'ruang'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 })
      }
    }

    // Validasi format kode
    const validate = validatePraktikumForm(body)
    if (!validate.isValid) {
      return NextResponse.json({ error: validate.errors }, { status: 400 })
    }

    // Cek apakah praktikum ada
    const existingPraktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId }
    })

    if (!existingPraktikum) {
      return NextResponse.json({ error: 'Praktikum tidak ditemukan' }, { status: 404 })
    }

    // Cek apakah kode praktikum sudah ada (kecuali untuk praktikum yang sedang diedit)
    if (body.kodePraktikum !== existingPraktikum.kodePraktikum) {
      const duplicateKode = await prisma.praktikum.findUnique({
        where: { kodePraktikum: body.kodePraktikum }
      })

      if (duplicateKode) {
        return NextResponse.json({ error: 'Kode praktikum sudah digunakan' }, { status: 400 })
      }
    }

    // Update praktikum
    const updatedPraktikum = await prisma.praktikum.update({
      where: { id: praktikumId },
      data: {
        nama: body.nama,
        kodePraktikum: body.kodePraktikum,
        kodeMk: body.kodeMk,
        kelas: body.kelas,
        semester: body.semester,
        tahun: body.tahun,
        jadwalHari: body.jadwalHari,
        jadwalJamMasuk: new Date(body.jadwalJamMasuk),
        jadwalJamSelesai: new Date(body.jadwalJamSelesai),
        ruang: body.ruang
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

    return NextResponse.json({ data: updatedPraktikum })
  } catch (error) {
    console.error('Error updating praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}