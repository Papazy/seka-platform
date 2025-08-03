import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params} : {params: Promise<{tugasId: string}>}) {
  const {tugasId}  = await params;

  try {

    const bahasa = await prisma.tugasBahasa.findMany({
      where: {
        idTugas: (tugasId)
      },
      include: {
        bahasa: true
      }
    })

    const formatResponse = bahasa.map((item) => ({
      id: item.idBahasa,
      nama: item.bahasa.nama,
      ekstensi: item.bahasa.ekstensi,
      compiler: item.bahasa.compiler,
      versi: item.bahasa.versi,
      createdAt: item.bahasa.createdAt.toISOString(),
      updatedAt: item.bahasa.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatResponse, {status: 200,})

  } catch (error) {
    console.error('Error fetching bahasa:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}