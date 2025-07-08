// app/api/laboran/dosen/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import csvParser from 'csv-parser'
import { Readable } from 'stream'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read and parse CSV
    const buffer = await file.arrayBuffer()
    const csvData = Buffer.from(buffer).toString('utf-8')
    
    const errors: string[] = []

    // Parse CSV
    const stream = Readable.from(csvData)
    const parser = csvParser()
    
    const parsedData = await new Promise((resolve, reject) => {
      const data: any[] = []
      stream
        .pipe(parser)
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', reject)
    })

    // Validate and prepare data
    const hashedPassword = await bcrypt.hash('dosen123', 10)
    let imported = 0

    for (const [index, row] of (parsedData as any[]).entries()) {
      const rowNum = index + 2 // +2 because CSV starts from row 2 (after header)
      
      // Validate required fields
      const requiredFields = ['nip', 'nama', 'email', 'jabatan', 'programStudiId']


      // // Validate email format
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      // if (!emailRegex.test(row.email)) {
      //   errors.push(`Baris ${rowNum}: Format email tidak valid`)
      //   continue
      // }

      // // Validate phone number format
      // const phoneRegex = /^[0-9+\-\s]+$/
      // if (!phoneRegex.test(row.noTelp)) {
      //   errors.push(`Baris ${rowNum}: Format nomor telepon tidak valid`)
      //   continue
      // }

      // Check if departemen exists
      const programStudi = await prisma.programStudi.findUnique({
        where: { id: parseInt(row.programStudiId) }
      })
      if (!programStudi) {
        errors.push(`Baris ${rowNum}: Program Studi dengan ID ${row.programStudiId} tidak ditemukan`)
        continue
      }
      // Check if NIDN or email already exists
      const existingDosen = await prisma.dosen.findFirst({
        where: {
          OR: [
            { nidn: row.nidn },
            { email: row.email }
          ]
        }
      })

      if (existingDosen) {
        errors.push(`Baris ${rowNum}: NIDN ${row.nidn} atau email ${row.email} sudah digunakan`)
        continue
      }

      try {
        // Create dosen
        await prisma.dosen.create({
          data: {
            nip: row.nip,
            nama: row.nama,
            email: row.email,
            jabatan: row.jabatan,
            programStudiId: parseInt(row.programStudiId),
            password: hashedPassword
          }
        })
        imported++
      } catch (error) {
        errors.push(`Baris ${rowNum}: Gagal menyimpan data - ${error}`)
      }
    }

    if (errors.length > 0 && imported === 0) {
      return NextResponse.json({ 
        error: 'Import gagal', 
        errors: errors.slice(0, 10) // Limit to 10 errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      imported, 
      errors: errors.slice(0, 10),
      message: `${imported} dosen berhasil diimpor${errors.length > 0 ? ` dengan ${errors.length} error` : ''}`
    })
  } catch (error) {
    console.error('Error importing dosen:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}