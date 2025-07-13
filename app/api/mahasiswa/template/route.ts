// app/api/mahasiswa/template/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'LABORAN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get program studi data untuk contoh
    const programStudiList = await prisma.programStudi.findMany({
      include: {
        fakultas: true
      },
      orderBy: {
        nama: 'asc'
      },
      take: 5 
    })

    let csvContent = `npm,nama,email,programStudi\n`
    
    
    
    
    // Data contoh dengan program studi yang benar-benar ada
    if (programStudiList.length > 0) {
      csvContent += `2108107010001,Ahmad Rahmani,ahmad.rahmani@student.usk.ac.id,${programStudiList[0].nama}\n`
      csvContent += `2108107010002,Siti Nurhaliza,siti.nurhalizi@student.usk.ac.id,${programStudiList[0].nama}\n`
      
      if (programStudiList.length > 1) {
        csvContent += `2109107010001,Budi Santosi,budi.santosi@student.usk.ac.id,${programStudiList[1].nama}\n`
      }
    } else {
      // Fallback jika tidak ada program studi
      csvContent += `2108107010001,Ahmad Rahmani,ahmad.rahmani@student.usk.ac.id,Informatika\n`
      csvContent += `2108107010002,Siti Nurhaliza,siti.nurhalizi@student.usk.ac.id,Informatika\n`
      csvContent += `2109107010001,Budi Santosi,budi.santosi@student.usk.ac.id,Informatika\n`
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="template_mahasiswa.csv"',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Error mendapatkan template mahasiswa:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}