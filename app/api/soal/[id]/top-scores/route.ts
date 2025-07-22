import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const soalId = parseInt(params.id)
    
    // Get top 10 submissions for this soal with highest scores
    const topSubmissions = await prisma.submission.findMany({
      where: {
        idSoal: soalId
      },
      include: {
        peserta: {
          include: {
            mahasiswa: true
          }
        }
      },
      orderBy: [
        { score: 'desc' },
        { submittedAt: 'asc' } // Earlier submission wins if same score
      ],
      take: 10
    })

    // Group by student and get their best submission
    const bestSubmissionsByStudent = new Map()
    
    topSubmissions.forEach(submission => {
      const studentKey = submission.peserta.mahasiswa.npm
      if (!bestSubmissionsByStudent.has(studentKey) || 
          bestSubmissionsByStudent.get(studentKey).score < submission.score) {
        bestSubmissionsByStudent.set(studentKey, submission)
      }
    })

    // Convert to array and sort again
    const topScores = Array.from(bestSubmissionsByStudent.values())
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      })
      .slice(0, 5)
      .map((submission, index) => ({
        rank: index + 1,
        nama: submission.peserta.mahasiswa.nama,
        npm: submission.peserta.mahasiswa.npm,
        score: submission.score,
        submittedAt: submission.submittedAt.toISOString()
      }))

    return NextResponse.json(topScores)
    
  } catch (error) {
    console.error('Error fetching top scores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top scores' },
      { status: 500 }
    )
  }
}