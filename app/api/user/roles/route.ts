import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const payload = await verifyToken(token);


  // Ambil roles dari database
  const asisten = await prisma.asistenPraktikum.findMany({
    where: { idMahasiswa: payload.id },
    select: { idPraktikum: true }
  })
  const peserta = await prisma.pesertaPraktikum.findMany({
    where: { idMahasiswa: payload.id },
    select: { idPraktikum: true }
  })

  // Susun roles, asisten prioritas
  const roles = [
    ...asisten.map(a => ({
      praktikumId: a.idPraktikum,
      role: 'ASISTEN',
      permissions: ['EDIT_SOAL', 'VIEW_SOAL']
    })),
    ...peserta
      .filter(p => !asisten.some(a => a.idPraktikum === p.idPraktikum))
      .map(p => ({
        praktikumId: p.idPraktikum,
        role: 'PESERTA',
        permissions: ['VIEW_SOAL']
      }))
  ]

  return NextResponse.json({ roles })
}