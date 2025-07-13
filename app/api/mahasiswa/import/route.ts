// app/api/laboran/mahasiswa/import/route.ts
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

    const buffer = await file.arrayBuffer()
    const csvData = Buffer.from(buffer).toString('utf-8')
    
    const records: any[] = []
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
    const hashedPassword = await bcrypt.hash('mahasiswa123', 10)
    let imported = 0

    for (const [index, row] of (parsedData as any[]).entries()) {
      const rowNum = index + 2 // +2 because CSV starts from row 2 (after header)
      
      // Validate required fields
      if (!row.npm || !row.nama || !row.email || !row.programStudi) {
        errors.push(`Baris ${rowNum}: Field npm, nama, email, dan programStudi wajib diisi`)
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(row.email)) {
        errors.push(`Baris ${rowNum}: Format email tidak valid`)
        continue
      }

      // Check if program studi exists
      const programStudi = await prisma.programStudi.findFirst({
        where: { nama: row.programStudi }
      })

      if (!programStudi) {
        errors.push(`Baris ${rowNum}: Program Studi dengan nama ${row.programStudi} tidak ditemukan`)
        continue
      }

      // Check if NPM or email already exists
      const existingMahasiswa = await prisma.mahasiswa.findFirst({
        where: {
          OR: [
            { npm: row.npm },
            { email: row.email }
          ]
        }
      })

    

      if (existingMahasiswa) {
        errors.push(`Baris ${rowNum}: NPM ${row.npm} atau email ${row.email} sudah digunakan`)
        continue
      }



      try {
        // Create mahasiswa
        await prisma.mahasiswa.create({
          data: {
            npm: row.npm,
            nama: row.nama,
            email: row.email,
            programStudiId: programStudi.id,
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
        errors: errors // Limit to 10 errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      imported, 
      errors: errors,
      message: `${imported} mahasiswa berhasil diimpor${errors.length > 0 ? ` dengan ${errors.length} error` : ''}`
    })
  } catch (error) {
    console.error('Error importing mahasiswa:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}