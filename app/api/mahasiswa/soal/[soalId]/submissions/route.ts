import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ soalId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    const idMahasiswa = payload.id;

    // 1. Cari soal untuk dapatkan idTugas
    const soal = await prisma.soal.findUnique({
      where: { id: params.soalId },
      select: { idTugas: true, tugas: { select: { idPraktikum: true } } },
    });
    if (!soal) {
      return NextResponse.json({ error: "Soal not found" }, { status: 404 });
    }
    const idPraktikum = soal.tugas.idPraktikum;

    // 2. Cari peserta praktikum milik mahasiswa di praktikum ini
    const peserta = await prisma.pesertaPraktikum.findUnique({
      where: {
        idMahasiswa_idPraktikum: {
          idMahasiswa,
          idPraktikum,
        },
      },
    });
    if (!peserta) {
      return NextResponse.json(
        { error: "Anda bukan peserta praktikum ini" },
        { status: 403 },
      );
    }

    const submissions = await prisma.submission.findMany({
      where: {
        idSoal: params.soalId,
        idPeserta: peserta.id,
      },
      include: {
        bahasa: true,
        testCaseResult: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
