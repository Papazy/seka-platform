import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    const idMahasiswa = payload.id;

    const {id, tugasId} = await params;

    const { pesertaId, totalNilai } = await req.json();

    // Cek asisten
    const asisten = await prisma.asistenPraktikum.findUnique({
      where: {
        idMahasiswa_idPraktikum: {
          idMahasiswa,
          idPraktikum: id,
        },
      },
    });
    if (!asisten)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Update nilai tugas
    const nilaiTugas = await prisma.nilaiTugas.findUnique({
      where: {
        idPeserta_idTugas: {
          idPeserta: pesertaId,
          idTugas: tugasId,
        },
      },
    });

    let updated;
    if (nilaiTugas) {
      updated = await prisma.nilaiTugas.update({
        where: { id: nilaiTugas.id },
        data: { totalNilai },
      });
    } else {
      updated = await prisma.nilaiTugas.create({
        data: {
          idPeserta: pesertaId,
          idTugas: tugasId,
          totalNilai,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
