import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try{
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const excludePraktikum = searchParams.get('exclude_praktikum') || '';

    const data = await prisma.mahasiswa.findMany({
      where: {
        AND: [
          {
            OR: [
              { nama: { contains: query } },
              { npm: { contains: query } },
              { email: { contains: query } }
            ],
          },
          excludePraktikum ? {
            pesertaPraktikum: {
              none: {
                idPraktikum: (excludePraktikum)
              }
            },
            asistenPraktikum: {
              none: {
                idPraktikum: (excludePraktikum)
              }
            },
          } : {}
        ]
      },
      select: {
        id: true,
        nama: true,
        npm: true,
        email: true,
        programStudi: {
          select: {
            nama: true,
            kodeProdi: true
          }
        }
      }
    });

    return NextResponse.json({ data }, {status: 200});
  }catch(error) {
    console.error("Error Fetching searchable mahasiswa: ", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}