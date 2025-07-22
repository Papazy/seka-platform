import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const soalId = parseInt(params.id)
    
    // Get current user's peserta record
    const peserta = await prisma.pesertaPraktikum.findFirst({
      where: {
        mahasiswa: {
          id: session.user.id
        }
      }
    })

    if (!peserta) {
      return NextResponse.json({ error: 'Not enrolled in any praktikum' }, { status: 403 })
    }

    // Get user's submissions for this soal
    const submissions = await prisma.submission.findMany({
      where: {
        idSoal: soalId,
        idPeserta: peserta.id
      },
      include: {
        bahasa: true,
        testCaseResult: {
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { submittedAt: 'desc' }
    })

    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      score: submission.score,
      attemptNumber: submission.attemptNumber,
      submittedAt: submission.submittedAt.toISOString(),
      sourceCode: submission.sourceCode,
      bahasa: {
        nama: submission.bahasa.nama,
        ekstensi: submission.bahasa.ekstensi
      },
      testCaseResult: submission.testCaseResult.map(result => ({
        status: result.status,
        waktuEksekusiMs: result.waktuEksekusiMs || 0,
        memoriKb: result.memoriKb || 0
      }))
    }))

    return NextResponse.json(formattedSubmissions)
    
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}