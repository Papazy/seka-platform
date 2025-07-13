// app/api/laboran/praktikum/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import csvParser from 'csv-parser'
import { Readable } from 'stream'

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

    let imported = 0

    for (const [index, row] of (parsedData as any[]).entries()) {
      const rowNum = index + 2 // +2 because CSV starts from row 2 (after header)
      
      // Validate required fields
      const requiredFields = [
        'nama', 'kodePraktikum', 'kodeMk', 'kelas', 'semester', 'tahun',
        'jadwalHari', 'jadwalJamMasuk', 'jadwalJamSelesai', 'ruang'
      ]
      
      const missingFields = requiredFields.filter(field => !row[field])
      if (missingFields.length > 0) {
        errors.push(`Baris ${rowNum}: Field wajib tidak diisi: ${missingFields.join(', ')}`)
        continue
      }

      // Validate format kode
      const kodeRegex = /^[A-Z0-9]{3,20}$/
      if (!kodeRegex.test(row.kodePraktikum)) {
        errors.push(`Baris ${rowNum}: Format kode praktikum tidak valid (harus 3-10 karakter huruf besar dan angka)`)
        continue
      }

      if (!kodeRegex.test(row.kodeMk)) {
        errors.push(`Baris ${rowNum}: Format kode mata kuliah tidak valid (harus 3-10 karakter huruf besar dan angka)`)
        continue
      }

      // Validate semester
      if (!['GANJIL', 'GENAP'].includes(row.semester)) {
        errors.push(`Baris ${rowNum}: Semester harus GANJIL atau GENAP`)
        continue
      }

      // Validate tahun
      const tahun = parseInt(row.tahun)
      if (isNaN(tahun) || tahun < 2020 || tahun > 2030) {
        errors.push(`Baris ${rowNum}: Tahun harus antara 2020-2030`)
        continue
      }

      // Validate hari
      const validHari = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']
      
      if (!validHari.includes(row.jadwalHari.toLowerCase())) {
        errors.push(`Baris ${rowNum}: Hari tidak valid (harus: ${validHari.join(', ')})`)
        continue
      }
      // Format and normalize hari
      const hariMap: { [key: string]: string } = {
        'senin': 'Senin',
        'selasa': 'Selasa', 
        'rabu': 'Rabu',
        'kamis': 'Kamis',
        'jumat': 'Jumat',
        'sabtu': 'Sabtu',
        'minggu': 'Minggu'
      }
      
      const normalizedHari = hariMap[row.jadwalHari.toLowerCase()]
      if (normalizedHari) {
        row.jadwalHari = normalizedHari
      }

      // Validate time format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(row.jadwalJamMasuk)) {
        errors.push(`Baris ${rowNum}: Format jam masuk tidak valid (harus HH:MM)`)
        continue
      }

      if (!timeRegex.test(row.jadwalJamSelesai)) {
        errors.push(`Baris ${rowNum}: Format jam selesai tidak valid (harus HH:MM)`)
        continue
      }

      // Validate time logic
      const jamMasuk = new Date(`2000-01-01T${row.jadwalJamMasuk}:00`)
      const jamSelesai = new Date(`2000-01-01T${row.jadwalJamSelesai}:00`)
      
      if (jamSelesai <= jamMasuk) {
        errors.push(`Baris ${rowNum}: Jam selesai harus lebih besar dari jam masuk`)
        continue
      }

      // Check if kode praktikum already exists
      const existingPraktikum = await prisma.praktikum.findUnique({
        where: { kodePraktikum: row.kodePraktikum }
      })

      if (existingPraktikum) {
        errors.push(`Baris ${rowNum-1}: Kode praktikum ${row.kodePraktikum} sudah digunakan`)
        continue
      }

      try {
        // Create praktikum
        await prisma.praktikum.create({
          data: {
            nama: row.nama,
            kodePraktikum: row.kodePraktikum,
            kodeMk: row.kodeMk,
            kelas: row.kelas,
            semester: row.semester,
            tahun: tahun,
            jadwalHari: row.jadwalHari,
            jadwalJamMasuk: new Date(`2000-01-01T${row.jadwalJamMasuk}:00`),
            jadwalJamSelesai: new Date(`2000-01-01T${row.jadwalJamSelesai}:00`),
            ruang: row.ruang,
            isActive: true,
            idLaboran: payload.id
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
      message: `${imported} praktikum berhasil diimpor${errors.length > 0 ? ` dengan ${errors.length} error` : ''}`
    })
  } catch (error) {
    console.error('Error importing praktikum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}