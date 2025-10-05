import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    const { id: soalId } = await params;

    // Get current user's peserta record
    const peserta = await prisma.pesertaPraktikum.findFirst({
      where: {
        mahasiswa: {
          id: payload.id,
        },
      },
    });

    if (!peserta) {
      return NextResponse.json(
        { error: "Not enrolled in any praktikum" },
        { status: 403 },
      );
    }

    // Get user's submissions for this soal
    const submissions = await prisma.submission.findMany({
      where: {
        idSoal: soalId,
        idPeserta: peserta.id,
      },
      include: {
        bahasa: true,
        testCaseResult: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      score: submission.score,
      submittedAt: submission.submittedAt.toISOString(),
      sourceCode: submission.sourceCode,
      bahasa: {
        nama: submission.bahasa.nama,
        ekstensi: submission.bahasa.ekstensi,
      },
      testCaseResult: submission.testCaseResult.map(result => ({
        status: result.status,
        waktuEksekusiMs: result.waktuEksekusiMs || 0,
        memoriKb: result.memoriKb || 0,
      })),
    }));

    return NextResponse.json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
