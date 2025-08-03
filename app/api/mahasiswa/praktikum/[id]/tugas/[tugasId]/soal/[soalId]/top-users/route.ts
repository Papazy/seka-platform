// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/top-users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: {params: Promise<{ id: string; tugasId: string; soalId: string }>}
) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const praktikumId = (params.id)
    const soalId = (params.soalId)

    // Get best submissions per user
    const bestSubmissions = await prisma.submission.findMany({
      where: {
        idSoal: soalId,
        peserta: {
          idPraktikum: praktikumId
        },
        score: {
          gt: 0
        }
      },
      include: {
        peserta: {
          include: {
            mahasiswa: true
          }
        },
        testCaseResult: true
      },
      orderBy: [
        { score: 'desc' },
        { submittedAt: 'asc' }
      ]
    })

    // Group by user and get best submission
    const userBestMap = new Map()
    
    bestSubmissions.forEach(sub => {
      const userId = sub.peserta.mahasiswa.npm
      if (!userBestMap.has(userId) || userBestMap.get(userId).score < sub.score) {
        const avgTime = sub.testCaseResult.reduce((sum, tcr) => sum + (tcr.waktuEksekusiMs || 0), 0) / sub.testCaseResult.length
        const avgMemory = sub.testCaseResult.reduce((sum, tcr) => sum + (tcr.memoriKb || 0), 0) / sub.testCaseResult.length
        
        userBestMap.set(userId, {
          npm: sub.peserta.mahasiswa.npm,
          nama: sub.peserta.mahasiswa.nama,
          score: sub.score,
          time: Math.round(avgTime),
          memory: Math.round(avgMemory),
          submittedAt: sub.submittedAt
        })
      }
    })

    const users = Array.from(userBestMap.values())

    // Sort by different criteria
    const byScore = [...users]
      .sort((a, b) => b.score - a.score || a.submittedAt - b.submittedAt)
      .map((user, index) => ({ ...user, rank: index + 1 }))

    const byTime = [...users]
      .filter(u => u.score === 100) // Only perfect scores
      .sort((a, b) => a.time - b.time)
      .map((user, index) => ({ ...user, rank: index + 1 }))

    const byMemory = [...users]
      .filter(u => u.score === 100) // Only perfect scores
      .sort((a, b) => a.memory - b.memory)
      .map((user, index) => ({ ...user, rank: index + 1 }))

    return NextResponse.json({
      score: byScore,
      time: byTime,
      memory: byMemory
    })

  } catch (error) {
    console.error('Error fetching top users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}