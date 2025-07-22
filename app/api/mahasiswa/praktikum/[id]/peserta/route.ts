import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const praktikumId = parseInt(params.id)
    const mahasiswaId = payload.id

    // Check access
    const [pesertaCheck, asistenCheck] = await Promise.all([
      prisma.pesertaPraktikum.findFirst({
        where: { idPraktikum: praktikumId, idMahasiswa: mahasiswaId }
      }),
      prisma.asistenPraktikum.findFirst({
        where: { idPraktikum: praktikumId, idMahasiswa: mahasiswaId }
      })
    ])

    if (!pesertaCheck && !asistenCheck) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const userRole = asistenCheck ? 'asisten' : 'peserta'

    // Fetch praktikum dengan instructor
    const praktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId },
      include: {
        laboran: {
          select: {
            nama: true,
            email: true
          }
        },
        dosenPraktikum: {
          include: {
            dosen: {
              select: {
                nama: true,
                nip: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!praktikum) {
      return NextResponse.json({ error: 'Praktikum not found' }, { status: 404 })
    }

    // Fetch semua tugas untuk menghitung stats
    const allTugas = await prisma.tugas.findMany({
      where: { idPraktikum: praktikumId },
      select: { id: true }
    })

    // Fetch asisten
    const asisten = await prisma.asistenPraktikum.findMany({
      where: { idPraktikum: praktikumId },
      include: {
        mahasiswa: {
          select: {
            id: true,
            nama: true,
            npm: true,
            email: true,
            programStudi: {
              select: {
                nama: true,
                kodeProdi: true,
              }
            }
          }
        }
      },
      orderBy: {
        mahasiswa: {
          nama: 'asc'
        }
      }
    })

    // Fetch peserta dengan stats
    const peserta = await prisma.pesertaPraktikum.findMany({
      where: { idPraktikum: praktikumId },
      include: {
        mahasiswa: {
          include: {
            programStudi: {
              select: {
                nama: true,
                kodeProdi: true
              }
            }
          }
        },
        nilaiTugas: {
          select: {
            idTugas: true,
            totalNilai: true
          }
        }
      },
      orderBy: {
        mahasiswa: {
          nama: 'asc'
        }
      }
    })

    // Transform data asisten
    const asistenData = asisten.map(a => ({
      id: a.mahasiswa.id,
      nama: a.mahasiswa.nama,
      npm: a.mahasiswa.npm,
      email: a.mahasiswa.email,
      joinedAt: a.createdAt.toISOString(),
      programStudi: {
        nama: a.mahasiswa.programStudi.nama,
        kodeProdi: a.mahasiswa.programStudi.kodeProdi
      },
    }))

    // Transform data peserta dengan stats
    const pesertaData = peserta.map(p => {
      const totalTugas = allTugas.length
      const totalTugasSelesai = p.nilaiTugas.length
      const rataRataNilai = totalTugasSelesai > 0 
        ? Math.round(p.nilaiTugas.reduce((sum, nt) => sum + nt.totalNilai, 0) / totalTugasSelesai)
        : 0

      return {
        id: p.mahasiswa.id,
        nama: p.mahasiswa.nama,
        npm: p.mahasiswa.npm,
        email: p.mahasiswa.email,
        joinedAt: p.createdAt.toISOString(),
        programStudi: {
          nama: p.mahasiswa.programStudi.nama,
          kodeProdi: p.mahasiswa.programStudi.kodeProdi
        },
        stats: {
          totalTugasSelesai,
          totalTugas,
          rataRataNilai
        }
      }
    })

    // Response
    const response = {
      praktikum: {
        id: praktikum.id,
        nama: praktikum.nama,
        kodePraktikum: praktikum.kodePraktikum,
        kelas: praktikum.kelas
      },
      dosen: praktikum.dosenPraktikum.map(dp => ({
        nama: dp.dosen.nama,
        nip: dp.dosen.nip,
        email: dp.dosen.email
      })),
      asisten: asistenData,
      peserta: pesertaData,
      userRole
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}