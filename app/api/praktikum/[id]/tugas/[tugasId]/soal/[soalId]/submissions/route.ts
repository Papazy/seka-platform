import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ soalId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    const idMahasiswa = payload.id;

    // Cek apakah user adalah asisten di praktikum soal ini
    const soal = await prisma.soal.findUnique({
      where: { id: params.soalId },
      select: { idTugas: true, tugas: { select: { idPraktikum: true } } },
    });
    if (!soal)
      return NextResponse.json({ error: "Soal not found" }, { status: 404 });
    const idPraktikum = soal.tugas.idPraktikum;

    const asisten = await prisma.asistenPraktikum.findUnique({
      where: {
        idMahasiswa_idPraktikum: {
          idMahasiswa,
          idPraktikum,
        },
      },
    });
    if (!asisten)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Ambil semua submission pada soal ini
    const submissions = await prisma.submission.findMany({
      where: { idSoal: params.soalId },
      include: {
        peserta: {
          include: { mahasiswa: true },
        },
        bahasa: true,
        testCaseResult: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    // Format agar ada info peserta
    const result = submissions.map(sub => ({
      ...sub,
      peserta: {
        id: sub.peserta.id,
        nama: sub.peserta.mahasiswa.nama,
        npm: sub.peserta.mahasiswa.npm,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
