import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const praktikumId = (params.id)
    const mahasiswaId = payload.id

    // ✅ Check access
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

    // ✅ Fetch praktikum info
    const praktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId },
      select: {
        id: true,
        nama: true,
        kodePraktikum: true,
        kelas: true
      }
    })

    if (!praktikum) {
      return NextResponse.json({ error: 'Praktikum not found' }, { status: 404 })
    }

    // ✅ Fetch tugas dengan total bobot
    const tugas = await prisma.tugas.findMany({
      where: { idPraktikum: praktikumId },
      include: {
        soal: {
          select: {
            id: true,
            judul: true,
            bobotNilai: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // ✅ Fetch all peserta dengan submission dan nilai
    const allPeserta = await prisma.pesertaPraktikum.findMany({
      where: { idPraktikum: praktikumId },
      include: {
        mahasiswa: {
          select: {
            id: true,
            nama: true,
            npm: true
          }
        },
        submission: {
          include: {
            soal: {
              select: {
                id: true,
                judul: true,
                bobotNilai: true,
                idTugas: true
              }
            }
          },
          orderBy: {
            submittedAt: 'desc'
          }
        }
      },
      orderBy: {
        mahasiswa: {
          nama: 'asc'
        }
      }
    })

    // ✅ Transform data dengan sistem persen per tugas
    const pesertaData = allPeserta.map(peserta => {
      const nilaiPerTugas = tugas.map(tugasItem => {
        // Calculate total possible score for this tugas
        const totalBobotTugas = tugasItem.soal.reduce((sum, soal) => sum + soal.bobotNilai, 0)
        
        // Calculate actual score for this peserta
        let totalNilaiDicapai = 0
        let submissionCount = 0
        let hasSubmission = false
        let lastSubmittedAt = null

        // Get soal scores for detailed view
        const soalScores = tugasItem.soal.map(soal => {
          const soalSubmissions = peserta.submission.filter(sub => sub.soal.id === soal.id)
          
          let bestScore = 0
          if (soalSubmissions.length > 0) {
            const bestSubmission = soalSubmissions.reduce((best, current) => 
              current.score > best.score ? current : best
            )
            bestScore = bestSubmission.score
            
            // Update tracking variables
            hasSubmission = true
            submissionCount += soalSubmissions.length
            
            if (!lastSubmittedAt || new Date(bestSubmission.submittedAt) > new Date(lastSubmittedAt)) {
              lastSubmittedAt = bestSubmission.submittedAt
            }
          }
          
          totalNilaiDicapai += bestScore

          return {
            soalId: soal.id,
            soalJudul: soal.judul,
            score: bestScore,
            maxScore: soal.bobotNilai
          }
        })

        // Calculate percentage (0-100)
        const nilaiPersen = totalBobotTugas > 0 
          ? Math.round((totalNilaiDicapai / totalBobotTugas) * 100)
          : 0

        return {
          tugasId: tugasItem.id,
          tugasJudul: tugasItem.judul,
          nilaiPersen,
          submissionCount,
          isSubmitted: hasSubmission,
          lastSubmittedAt,
          soalScores
        }
      })

      // Calculate total nilai (average of all tugas in percentage)
      const tugasSelesai = nilaiPerTugas.filter(nt => nt.isSubmitted)
      const totalNilai = tugasSelesai.length > 0 
        ? Math.round(tugasSelesai.reduce((sum, nt) => sum + nt.nilaiPersen, 0) / tugas.length)
        : 0

      return {
        id: peserta.mahasiswa.id,
        nama: peserta.mahasiswa.nama,
        npm: peserta.mahasiswa.npm,
        nilaiPerTugas,
        totalNilai,
        rataRata: totalNilai, // same as totalNilai for compatibility
        totalTugasSelesai: tugasSelesai.length,
        totalTugas: tugas.length
      }
    })

    // ✅ Calculate class statistics
    const totalPeserta = pesertaData.length
    const rataRataKelas = totalPeserta > 0 
      ? Math.round(pesertaData.reduce((sum, p) => sum + p.rataRata, 0) / totalPeserta)
      : 0

    // Calculate average per tugas for class
    const tugasStats = tugas.map(tugasItem => {
      const pesertaYangSubmit = pesertaData.filter(p => 
        p.nilaiPerTugas.find(nt => nt.tugasId === tugasItem.id)?.isSubmitted
      )
      
      const rataRataTugas = pesertaYangSubmit.length > 0
        ? Math.round(
            pesertaYangSubmit.reduce((sum, p) => {
              const nilaiTugas = p.nilaiPerTugas.find(nt => nt.tugasId === tugasItem.id)
              return sum + (nilaiTugas?.nilaiPersen || 0)
            }, 0) / pesertaYangSubmit.length
          )
        : 0

      return {
        tugasId: tugasItem.id,
        tugasJudul: tugasItem.judul,
        rataRata: rataRataTugas
      }
    })

    const tugasTertinggi = tugasStats.reduce((highest, current) => 
      current.rataRata > highest.rataRata ? current : highest
    )
    
    const tugasTerendah = tugasStats.reduce((lowest, current) => 
      current.rataRata < lowest.rataRata ? current : lowest
    )

    // ✅ Transform tugas untuk response
    const tugasResponse = tugas.map(t => ({
      id: t.id,
      judul: t.judul,
      totalSoal: t.soal.length,
      totalBobot: t.soal.reduce((sum, soal) => sum + soal.bobotNilai, 0),
      deadline: t.deadline.toISOString(),
      soal: t.soal.map(s => ({
        id: s.id,
        judul: s.judul,
        bobotNilai: s.bobotNilai
      }))
    }))

    const response = {
      praktikum,
      tugas: tugasResponse,
      peserta: pesertaData,
      statistik: {
        totalPeserta,
        rataRataKelas,
        tugasTertinggi: {
          tugasJudul: tugasTertinggi.tugasJudul,
          rataRata: tugasTertinggi.rataRata
        },
        tugasTerendah: {
          tugasJudul: tugasTerendah.tugasJudul,
          rataRata: tugasTerendah.rataRata
        }
      },
      userRole
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}