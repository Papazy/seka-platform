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

    const { id, tugasId } = await params;

    const { pesertaId, totalNilai } = await req.json();
    const soals = await prisma.soal.findMany({
      where: { idTugas: tugasId },
    });

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
    const hasilTugasMahasiswa = await prisma.hasilTugasMahasiswa.findUnique({
      where: {
        idPeserta_idTugas: {
          idPeserta: pesertaId,
          idTugas: tugasId,
        },
      },
    });

    let updated;
    if (hasilTugasMahasiswa) {
      updated = await prisma.hasilTugasMahasiswa.update({
        where: { id: hasilTugasMahasiswa.id },
        data: { totalNilai },
      });
    } else {
      updated = await prisma.hasilTugasMahasiswa.create({
        data: {
          idPeserta: pesertaId,
          idTugas: tugasId,
          totalNilai,
          status: "DISERAHKAN",
          jumlahSubmission: 0,
          jumlahSoalSelesai: 0,
          jumlahSoal: soals.length || 0,
          isLate: false,
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
