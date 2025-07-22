// app/api/bahasa-pemrograman/route.ts
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
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const bahasa = await prisma.bahasaPemrograman.findMany({
      orderBy: { nama: 'asc' }
    })

    return NextResponse.json(bahasa)

  } catch (error) {
    console.error('Error fetching programming languages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}