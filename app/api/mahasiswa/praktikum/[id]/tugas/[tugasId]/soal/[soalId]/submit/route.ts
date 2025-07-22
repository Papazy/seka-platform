// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/submit/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; tugasId: string; soalId: string } }
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

    const praktikumId = parseInt(params.id)
    const tugasId = parseInt(params.tugasId)
    const soalId = parseInt(params.soalId)
    const mahasiswaId = payload.id

    const { sourceCode, idBahasa } = await req.json()

    if (!sourceCode?.trim()) {
      return NextResponse.json({ error: 'Source code tidak boleh kosong' }, { status: 400 })
    }

    // Get peserta info
    const peserta = await prisma.pesertaPraktikum.findFirst({
      where: {
        idMahasiswa: mahasiswaId,
        idPraktikum: praktikumId
      }
    })

    if (!peserta) {
      return NextResponse.json({ error: 'Anda bukan peserta praktikum ini' }, { status: 403 })
    }

    // Check tugas and soal exist
    const soal = await prisma.soal.findFirst({
      where: {
        id: soalId,
        tugas: {
          id: tugasId,
          idPraktikum: praktikumId
        }
      },
      include: {
        tugas: true,
        testCase: true
      }
    })

    if (!soal) {
      return NextResponse.json({ error: 'Soal tidak ditemukan' }, { status: 404 })
    }

    // Check deadline
    if (new Date() > new Date(soal.tugas.deadline)) {
      return NextResponse.json({ error: 'Deadline sudah terlewat' }, { status: 400 })
    }

    // Check submission limit
    const submissionCount = await prisma.submission.count({
      where: {
        idSoal: soalId,
        idPeserta: peserta.id
      }
    })

    if (submissionCount >= soal.tugas.maksimalSubmit) {
      return NextResponse.json({ error: 'Anda sudah mencapai batas maksimal submit' }, { status: 400 })
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        idSoal: soalId,
        idPeserta: peserta.id,
        idBahasa: idBahasa,
        sourceCode: sourceCode,
        attemptNumber: submissionCount + 1,
        score: 0 // Will be updated by judge
      }
    })

    // TODO: Add to judge queue
    // For now, simulate judging with dummy results
    let totalScore = 0
    const testCaseResults = []

    for (const testCase of soal.testCase) {
      // Simulate judging
      const isCorrect = Math.random() > 0.3 // 70% chance correct
      const status = isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER'
      
      const result = await prisma.testCaseResult.create({
        data: {
          idSubmission: submission.id,
          idTestCase: testCase.id,
          status: status,
          outputDihasilkan: isCorrect ? 'Correct output' : 'Wrong output',
          waktuEksekusiMs: Math.floor(Math.random() * 1000),
          memoriKb: Math.floor(Math.random() * 50000) + 10000
        }
      })

      testCaseResults.push(result)
      if (isCorrect) totalScore += Math.floor(100 / soal.testCase.length)
    }

    // Update submission score
    await prisma.submission.update({
      where: { id: submission.id },
      data: { score: Math.min(totalScore, 100) }
    })

    return NextResponse.json({ 
      message: 'Submission berhasil', 
      submissionId: submission.id,
      score: totalScore
    })

  } catch (error) {
    console.error('Error submitting code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/test/route.ts
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; tugasId: string; soalId: string } }
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

    const soalId = parseInt(params.soalId)
    const { sourceCode, idBahasa } = await req.json()

    if (!sourceCode?.trim()) {
      return NextResponse.json({ error: 'Source code tidak boleh kosong' }, { status: 400 })
    }

    // Get contoh test case
    const contohTestCase = await prisma.contohTestCase.findMany({
      where: { idSoal: soalId },
      orderBy: { id: 'asc' }
    })

    // Simulate testing with example test cases
    const results = contohTestCase.map((tc, index) => {
      const isCorrect = Math.random() > 0.4 // 60% chance correct
      return {
        testCase: index + 1,
        status: isCorrect ? 'ACCEPTED' : 'WRONG_ANSWER',
        output: isCorrect ? tc.contohOutput : 'Different output',
        expected: tc.contohOutput,
        time: Math.floor(Math.random() * 500),
        memory: Math.floor(Math.random() * 30000) + 10000
      }
    })

    return NextResponse.json({ results })

  } catch (error) {
    console.error('Error testing code:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}