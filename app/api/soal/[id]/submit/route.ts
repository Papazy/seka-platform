import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { StatusSubmissionTugas } from '@/lib/enum'


export async function POST(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }>}
) {
  try {

    const soalId = (params.id)
    const { sourceCode, languageId } = await request.json()

    if (!sourceCode || !languageId) {
      return NextResponse.json(
        { error: 'Source code and language are required' },
        { status: 400 }
      )
    }

    const token = request.cookies.get('token')?.value
    if(!token){
      return NextResponse.json(
        {error: 'Unauthorized'},
        {status: 403}
      )
    }

    const user = await verifyToken(token)


    // periksa peserta
    const peserta = await prisma.pesertaPraktikum.findFirst({
      where: {
        mahasiswa: {
          id: user.id
        }
      }
    })

    if (!peserta) {
      return NextResponse.json({ error: 'Not enrolled in any praktikum' }, { status: 403 })
    }

    // ambil tugas
    const soal = await prisma.soal.findUnique({
      where: { id: soalId },
      include: {
        tugas: true,
        testCase: true
      }
    })

    if (!soal) {
      return NextResponse.json({ error: 'Soal not found' }, { status: 404 })
    }

    // Check deadline
    let statusSubmission : StatusSubmissionTugas = StatusSubmissionTugas.DISERAHKAN
    if (new Date() > soal.tugas.deadline) {
      statusSubmission = StatusSubmissionTugas.TERLAMBAT
    }

    // Check jumlah submission
    const submissionCount = await prisma.submission.count({
      where: {
        idSoal: soalId,
        idPeserta: peserta.id
      }
    })

    if (submissionCount >= soal.tugas.maksimalSubmit) {
      return NextResponse.json(
        { error: `Maksimal ${soal.tugas.maksimalSubmit} kali submit` },
        { status: 400 }
      )
    }

    // bahasa
    const bahasa = await prisma.bahasaPemrograman.findUnique({
      where: { id: languageId }
    })

    if (!bahasa) {
      return NextResponse.json({ error: 'Language not found' }, { status: 404 })
    }

    // testcase
    const testCases = soal.testCase.map(tc => ({
      input: tc.input,
      expected_output: tc.outputDiharapkan
    }))

    // send ke judger
    const judgePayload = {
      code: sourceCode,
      test_cases: testCases,
      language: bahasa.nama.toLowerCase()
    }

    const judgeResponse = await fetch(`${process.env.JUDGE_API_URL}/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(judgePayload)
    })

    if (!judgeResponse.ok) {
      throw new Error('Judge API error')
    }

    const judgeResult = await judgeResponse.json()

    // Calculate score based on test results
    let score = 0
    if (judgeResult.status === 'finished' && judgeResult.results) {
      const passedTests = judgeResult.results.filter((r: any) => r.passed).length
      const totalTests = judgeResult.results.length
      score = Math.round((passedTests / totalTests) * soal.bobotNilai)
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        idSoal: soalId,
        idPeserta: peserta.id,
        idBahasa: languageId,
        sourceCode,
        score,
        statusJawaban: statusSubmission,
      }
    })

    // hasil test case
    if (judgeResult.status === 'finished' && judgeResult.results) {
      for (let i = 0; i < judgeResult.results.length; i++) {
        const result = judgeResult.results[i]
        const testCase = soal.testCase[i]
        
        if (testCase) {
          await prisma.testCaseResult.create({
            data: {
              idSubmission: submission.id,
              idTestCase: testCase.id,
              status: result.passed ? 'ACCEPTED' : 
                     result.status === 'timeout' ? 'TIME_LIMIT_EXCEEDED' : 'WRONG_ANSWER',
              outputDihasilkan: result.actual_output,
              waktuEksekusiMs: Math.round(result.execution_time * 1000),
              memoriKb: 0 // perlu segera dibuat di judge
            }
          })
        }
      }
    } else if (judgeResult.status === 'compile_error') {
      // jika CE, buat satu error saja
      const firstTestCase = soal.testCase[0]
      if (firstTestCase) {
        await prisma.testCaseResult.create({
          data: {
            idSubmission: submission.id,
            idTestCase: firstTestCase.id,
            status: 'COMPILATION_ERROR',
            outputDihasilkan: judgeResult.error_message,
            waktuEksekusiMs: 0,
            memoriKb: 0
          }
        })
      }
    }

    // Update or create nilai tugas
    const existingNilaiTugas = await prisma.nilaiTugas.findUnique({
      where: {
        idPeserta_idTugas: {
          idPeserta: peserta.id,
          idTugas: soal.idTugas
        }
      }
    })

    // Calculate total score for this tugas
    const allSoalInTugas = await prisma.soal.findMany({
      where: { idTugas: soal.idTugas },
      include: {
        submission: {
          where: { idPeserta: peserta.id },
          orderBy: { score: 'desc' },
          take: 1
        }
      }
    })

    // total tugas (setiap soal diambil yg terbaik)
    const totalNilaiTugas = allSoalInTugas.reduce((acc, cur)=>{
      const bestSubmission = cur.submission[0]
      return acc + (bestSubmission ? bestSubmission.score : 0)
    }, 0)

    // UPSERT
    if (existingNilaiTugas) {
      await prisma.nilaiTugas.update({
        where: { id: existingNilaiTugas.id },
        data: { totalNilai: totalNilaiTugas, status: statusSubmission },
        
      })
    } else {
      await prisma.nilaiTugas.create({
        data: {
          idPeserta: peserta.id,
          idTugas: soal.idTugas,
          totalNilai: totalNilaiTugas,
          status: statusSubmission
        }
      })
    }

    return NextResponse.json({
      submissionId: submission.id,
      score,
      judgeResult,
      message: 'Submission successful'
    })
    
  } catch (error) {
    console.error('Error submitting code:', error)
    return NextResponse.json(
      { error: 'Failed to submit code' },
      { status: 500 }
    )
  }
}