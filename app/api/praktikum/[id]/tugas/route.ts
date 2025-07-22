// app/api/praktikum/[id]/tugas/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const mahasiswaId = payload.id

    // Check if user is asisten of this praktikum
    const asistenCheck = await prisma.asistenPraktikum.findFirst({
      where: {
        idPraktikum: praktikumId,
        idMahasiswa: mahasiswaId
      }
    })

    if (!asistenCheck) {
      return NextResponse.json({ error: 'Hanya asisten yang bisa membuat tugas' }, { status: 403 })
    }

    const body = await req.json()
    const { tugas: tugasData, soal: soalData } = body

    // Validation
    if (!tugasData.judul || !tugasData.deskripsi || !tugasData.deadline) {
      return NextResponse.json({ error: 'Data tugas tidak lengkap' }, { status: 400 })
    }

    if (!soalData || soalData.length === 0) {
      return NextResponse.json({ error: 'Minimal harus ada 1 soal' }, { status: 400 })
    }

    // Create tugas and soal in transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Create tugas
      const tugas = await tx.tugas.create({
        data: {
          idPraktikum: praktikumId,
          idAsisten: asistenCheck.id,
          judul: tugasData.judul,
          deskripsi: tugasData.deskripsi,
          deadline: new Date(tugasData.deadline),
          maksimalSubmit: tugasData.maksimalSubmit || 3
        }
      })

      // 2. Create soal for each soal data
      const createdSoal = []
      
      for (const soalItem of soalData) {
        const soal = await tx.soal.create({
          data: {
            idTugas: tugas.id,
            judul: soalItem.judul,
            deskripsi: soalItem.deskripsi,
            batasan: soalItem.batasan,
            formatInput: soalItem.formatInput,
            formatOutput: soalItem.formatOutput,
            batasanMemoriKb: soalItem.batasanMemoriKb,
            batasanWaktuEksekusiMs: soalItem.batasanWaktuEksekusiMs,
            templateKode: soalItem.templateKode,
            bobotNilai: soalItem.bobotNilai
          }
        })

        // 3. Create contoh test case
        if (soalItem.contohTestCase && soalItem.contohTestCase.length > 0) {
          await tx.contohTestCase.createMany({
            data: soalItem.contohTestCase.map((tc: any) => ({
              idSoal: soal.id,
              contohInput: tc.contohInput,
              contohOutput: tc.contohOutput,
              penjelasanInput: tc.penjelasanInput,
              penjelasanOutput: tc.penjelasanOutput
            }))
          })
        }

        // 4. Create test case
        if (soalItem.testCase && soalItem.testCase.length > 0) {
          await tx.testCase.createMany({
            data: soalItem.testCase.map((tc: any) => ({
              idSoal: soal.id,
              input: tc.input,
              outputDiharapkan: tc.outputDiharapkan
            }))
          })
        }

        createdSoal.push(soal)
      }

      return { tugas, soal: createdSoal }
    })

    return NextResponse.json({ 
      message: 'Tugas dan soal berhasil dibuat',
      tugasId: result.tugas.id,
      totalSoal: result.soal.length
    })

  } catch (error) {
    console.error('Error creating tugas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}