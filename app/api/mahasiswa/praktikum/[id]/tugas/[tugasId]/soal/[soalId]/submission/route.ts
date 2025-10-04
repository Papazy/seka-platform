// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; tugasId: string; soalId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const praktikumId = params.id;
    const soalId = params.soalId;
    const mahasiswaId = payload.id;

    // Get user's submissions for this soal
    const submissions = await prisma.submission.findMany({
      where: {
        idSoal: soalId,
        peserta: {
          idMahasiswa: mahasiswaId,
          idPraktikum: praktikumId,
        },
      },
      include: {
        bahasa: true,
        testCaseResult: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formattedSubmissions = submissions.map(sub => ({
      id: sub.id,
      score: sub.score,
      attemptNumber: sub.attemptNumber,
      submittedAt: sub.submittedAt.toISOString(),
      sourceCode: sub.sourceCode,
      bahasa: sub.bahasa,
      testCaseResults: sub.testCaseResult.map(tcr => ({
        id: tcr.id,
        status: tcr.status,
        outputDihasilkan: tcr.outputDihasilkan,
        waktuEksekusiMs: tcr.waktuEksekusiMs,
        memoriKb: tcr.memoriKb,
      })),
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
