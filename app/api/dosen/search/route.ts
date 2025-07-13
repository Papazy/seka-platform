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

    const data = await prisma.dosen.findMany({
      where: {
        AND: [
          {
            OR: [
              { nama: { contains: query } },
              { nip: { contains: query } },
              { email: { contains: query } }
            ],
          },
          excludePraktikum ? {
            dosenPraktikum: {
              none: {
                idPraktikum: parseInt(excludePraktikum)
              }
            }
          } : {}
        ]
      },
      select: {
        id: true,
        nama: true,
        nip: true,
        email: true,
        jabatan: true,
      }
    });

    return NextResponse.json({ data }, {status: 200});
  }catch(error) {
    console.error("Error Fetching searchable dosen: ", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}