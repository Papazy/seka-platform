import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    const idMahasiswa = payload.id;
    const { submissionId } = await params;

    // Cek submission dan soal
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        soal: { include: { tugas: true } },
      },
    });
    if (!submission)
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );

    // Cek asisten
    const idPraktikum = submission.soal.tugas.idPraktikum;
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

    // Update score
    const { score } = await req.json();
    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: { score },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
