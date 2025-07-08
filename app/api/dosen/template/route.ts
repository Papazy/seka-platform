// app/api/laboran/dosen/template/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const csvContent = `nip,nama,email,jabatan,programStudiId
123456789,Dr. John Doe,johndoe@usk.ac.id,Dosen Tetap,1
123456788,Dr. Jane Smith,janesmith@usk.ac.id,Dosen Tidak Tetap,1
123456787,Prof. Bob Johnson,bobjohnson@usk.ac.id,Profesor,1`

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="template_dosen.csv"'
      }
    })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}