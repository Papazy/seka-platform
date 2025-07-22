import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { tugasId: string } }
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

    const tugasId = parseInt(params.tugasId)
    const soalData = await req.json()

    // Verify user is asisten of this tugas
    const tugas = await prisma.tugas.findUnique({
      where: { id: tugasId },
      include: {
        asisten: {
          include: { mahasiswa: true }
        }
      }
    })

    if (!tugas || tugas.asisten.mahasiswa.id !== payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create soal in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create soal
      const soal = await tx.soal.create({
        data: {
          idTugas: tugasId,
          judul: soalData.judul,
          deskripsi: soalData.deskripsi,
          batasan: soalData.batasan || '',
          formatInput: soalData.formatInput || '',
          formatOutput: soalData.formatOutput || '',
          batasanMemoriKb: soalData.batasanMemoriKb,
          batasanWaktuEksekusiMs: soalData.batasanWaktuEksekusiMs,
          templateKode: soalData.templateKode || '',
          bobotNilai: soalData.bobotNilai
        }
      })

      // Create contoh test case
      if (soalData.contohTestCase?.length > 0) {
        await tx.contohTestCase.createMany({
          data: soalData.contohTestCase.map((tc: any) => ({
            idSoal: soal.id,
            contohInput: tc.contohInput || '',
            contohOutput: tc.contohOutput || '',
            penjelasanInput: tc.penjelasanInput || '',
            penjelasanOutput: tc.penjelasanOutput || ''
          }))
        })
      }

      // Create test case
      if (soalData.testCase?.length > 0) {
        await tx.testCase.createMany({
          data: soalData.testCase.map((tc: any) => ({
            idSoal: soal.id,
            input: tc.input,
            outputDiharapkan: tc.outputDiharapkan
          }))
        })
      }

      return soal
    })

    return NextResponse.json({ 
      message: 'Soal berhasil dibuat',
      soalId: result.id
    })

  } catch (error) {
    console.error('Error creating soal:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}