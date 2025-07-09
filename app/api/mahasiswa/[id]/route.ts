// app/api/mahasiswa/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    const mahasiswaId = parseInt(params.id)
    
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: {
        programStudi: {
          include: {
            fakultas: true
          }
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true
          }
        },
        pesertaPraktikum: {
          include: {
            praktikum: {
              select: {
                id: true,
                nama: true,
                kodePraktikum: true,
                kelas: true,
                semester: true,
                tahun: true,
                jadwalHari: true,
                ruang: true,
                dosenPraktikum: {
                  include: {
                    dosen: {
                      select: {
                        nama: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        asistenPraktikum: {
          include: {
            praktikum: {
              select: {
                id: true,
                nama: true,
                kodePraktikum: true,
                kelas: true,
                semester: true,
                tahun: true,
                jadwalHari: true,
                ruang: true,
                dosenPraktikum: {
                  include: {
                    dosen: {
                      select: {
                        nama: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!mahasiswa) {
      return NextResponse.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 })
    }

    // Transform data untuk memudahkan akses di frontend
    const transformedData = {
      ...mahasiswa,
      pesertaPraktikum: mahasiswa.pesertaPraktikum.map(p => ({
        id: p.praktikum.id,
        nama: p.praktikum.nama,
        kodePraktikum: p.praktikum.kodePraktikum,
        kelas: p.praktikum.kelas,
        semester: p.praktikum.semester,
        tahun: p.praktikum.tahun,
        status: 'active',
        joinedAt: p.createdAt,
        praktikum: {
          jadwalHari: p.praktikum.jadwalHari,
          ruang: p.praktikum.ruang,
          dosen: p.praktikum.dosenPraktikum.map(dp => dp.dosen)
        }
      })),
      asistenPraktikum: mahasiswa.asistenPraktikum.map(a => ({
        id: a.praktikum.id,
        nama: a.praktikum.nama,
        kodePraktikum: a.praktikum.kodePraktikum,
        kelas: a.praktikum.kelas,
        semester: a.praktikum.semester,
        tahun: a.praktikum.tahun,
        status: 'active',
        joinedAt: a.createdAt,
        praktikum: {
          jadwalHari: a.praktikum.jadwalHari,
          ruang: a.praktikum.ruang,
          dosen: a.praktikum.dosenPraktikum.map(dp => dp.dosen)
        }
      }))
    }

    return NextResponse.json({ data: transformedData })
  } catch (error) {
    console.error('Error fetching mahasiswa:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const mahasiswaId = parseInt(params.id)
    const body = await request.json()
    
    // Validasi input
    const requiredFields = ['npm', 'nama', 'email', 'programStudiId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 })
      }
    }

    // Cek apakah mahasiswa exists
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId }
    })

    if (!existingMahasiswa) {
      return NextResponse.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 })
    }

    // Cek apakah NPM atau email sudah digunakan oleh mahasiswa lain
    const duplicateMahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        AND: [
          { id: { not: mahasiswaId } },
          {
            OR: [
              { npm: body.npm },
              { email: body.email }
            ]
          }
        ]
      }
    })

    if (duplicateMahasiswa) {
      if (duplicateMahasiswa.npm === body.npm) {
        return NextResponse.json({ error: 'NPM sudah digunakan' }, { status: 400 })
      }
      if (duplicateMahasiswa.email === body.email) {
        return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 400 })
      }
    }

    // Update mahasiswa
    const updatedMahasiswa = await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        npm: body.npm,
        nama: body.nama,
        email: body.email,
        programStudiId: body.programStudiId
      },
      include: {
        programStudi: {
          include: {
            fakultas: true
          }
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true
          }
        }
      }
    })

    return NextResponse.json({ data: updatedMahasiswa })
  } catch (error) {
    console.error('Error updating mahasiswa:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const mahasiswaId = parseInt(params.id)
    
    // Cek apakah mahasiswa exists
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: {
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true
          }
        }
      }
    })

    if (!existingMahasiswa) {
      return NextResponse.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 })
    }

    // Cek apakah mahasiswa masih terlibat dalam praktikum
    if (existingMahasiswa._count.pesertaPraktikum > 0 || existingMahasiswa._count.asistenPraktikum > 0) {
      return NextResponse.json({ 
        error: 'Tidak dapat menghapus mahasiswa yang masih terlibat dalam praktikum' 
      }, { status: 400 })
    }

    // Delete mahasiswa
    await prisma.mahasiswa.delete({
      where: { id: mahasiswaId }
    })

    return NextResponse.json({ message: 'Mahasiswa berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting mahasiswa:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}