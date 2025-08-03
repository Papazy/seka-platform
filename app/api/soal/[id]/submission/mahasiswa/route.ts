import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params} : {params: Promise<{id: string}>}){
  try{
    const soalId = (params.id);
    const token = req.cookies.get('token')?.value

    if(!token){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const mahasiswaId = payload.id


    const submissions = await prisma.submission.findMany({
      where: {
        id: soalId,
        idPeserta: mahasiswaId
      },
    });

    return NextResponse.json(submissions || { error: 'Soal not found' }, { status: submissions ? 200 : 404 });

  }catch(error){
    console.error(error || 'Error fetching soal');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

