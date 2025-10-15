// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { BahasaPemrograman, ContohTestCase, Mahasiswa, Prisma, Submission, TestCase, TestCaseResult } from "@prisma/client";

interface SoalResponse {
  id: string;
  judul: string;
  deskripsi: string;
  batasan: string;
  formatInput: string;
  formatOutput: string;
  batasanMemoriKb: number;
  batasanWaktuEksekusiMs: number;
  templateKode: string;
  bobotNilai: number;
  contohTestCase: ContohTestCase[];
  totalTestCase: number;
  userRole: "peserta" | "asisten" | null;
  tugas: {
    id: string;
    judul: string;
    maksimalSubmit: number;
    deadline: string;
    isOverdue: boolean;
    pembuat: {
      nama: string;
      npm: string;
    };
  };
  userStats?: {
    submissionCount: number;
    bestScore: number;
    canSubmit: boolean;
  };
  asistenStats?: {
    totalSubmissions: number;
    uniqueSubmitters: number;
    totalPeserta: number;
    participationRate: number;
    submissionStats: {
      perfect: number;
      partial: number;
      failed: number;
    };
    averageScore: number;
  };
  testCases?: TestCase[];
}

interface SubmissionWithRelations extends Submission {
  bahasa: BahasaPemrograman;
  testCaseResult: TestCaseResult[];
  peserta: {
    idMahasiswa: string;
    mahasiswa: Mahasiswa;
  };
}

interface UpdateSoalRequest {
  judul: string;
  deskripsi: string;
  batasan: string;
  formatInput: string;
  formatOutput: string;
  batasanMemoriKb: number;
  batasanWaktuEksekusiMs: number;
  templateKode: string;
  bobotNilai: number;
  contohTestCase: ContohTestCase[];
  testCase: TestCase[];
}

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

    const { id: praktikumId } = await params;
    const { tugasId } = await params;
    const { soalId } = await params;
    const mahasiswaId = payload.id;

    // Check user role and access
    let userRole: "peserta" | "asisten" | null = null;
    let pesertaId: string | null = null;

    // Check if user is peserta
    const pesertaCheck = await prisma.pesertaPraktikum.findFirst({
      where: {
        idPraktikum: praktikumId,
        idMahasiswa: mahasiswaId,
      },
    });

    if (pesertaCheck) {
      userRole = "peserta";
      pesertaId = pesertaCheck.id;
    } else {
      // Check if user is asisten
      const asistenCheck = await prisma.asistenPraktikum.findFirst({
        where: {
          idPraktikum: praktikumId,
          idMahasiswa: mahasiswaId,
        },
      });

      if (asistenCheck) {
        userRole = "asisten";
      }
    }

    if (!userRole) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses ke praktikum ini" },
        { status: 403 },
      );
    }

    // Get soal with role-based data
    const soalInclude: Prisma.SoalInclude = {
      contohTestCase: {
        orderBy: { id: "asc" },
      },
      testCase: {
        select: { id: true }, // Count only for peserta, full data for asisten
      },
    };

    // Add submission data based on role
    if (userRole === "peserta") {
      soalInclude.submission = {
        where: {
          idPeserta: pesertaId || '',
        },
        include: {
          bahasa: true,
          testCaseResult: true,
        },
        orderBy: { submittedAt: "desc" },
      };
    } else if (userRole === "asisten") {
      // Asisten can see all submissions for this soal
      soalInclude.submission = {
        include: {
          peserta: {
            include: {
              mahasiswa: true,
            },
          },
          bahasa: true,
          testCaseResult: {
            include: {
              testCase: true, // Asisten can see test case details
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      };

      // Asisten can see actual test cases
      soalInclude.testCase = {
        orderBy: { id: "asc" },
      };
    }



    const soal = await prisma.soal.findFirst({
      where: {
        id: soalId,
        tugas: {
          id: tugasId,
          idPraktikum: praktikumId,
        },
      },
      include: {
        ...soalInclude, 
        tugas: {
          include: {
            praktikum: true,
            asisten: {
              include: {
                mahasiswa: true,
              },
            },
          },
      },},
    });

    if (!soal) {
      return NextResponse.json({ error: "Soal not found" }, { status: 404 });
    }

    // Base response
    const response: SoalResponse = {
      id: soal.id,
      judul: soal.judul,
      deskripsi: soal.deskripsi,
      batasan: soal.batasan,
      formatInput: soal.formatInput,
      formatOutput: soal.formatOutput,
      batasanMemoriKb: soal.batasanMemoriKb,
      batasanWaktuEksekusiMs: soal.batasanWaktuEksekusiMs,
      templateKode: soal.templateKode,
      bobotNilai: soal.bobotNilai,
      contohTestCase: soal.contohTestCase,
      totalTestCase: soal.testCase.length,
      userRole,
      tugas: {
        id: soal.tugas.id,
        judul: soal.tugas.judul,
        maksimalSubmit: soal.tugas.maksimalSubmit,
        deadline: soal.tugas.deadline.toISOString(),
        isOverdue: new Date() > new Date(soal.tugas.deadline),
        pembuat: {
          nama: soal.tugas.asisten.mahasiswa.nama,
          npm: soal.tugas.asisten.mahasiswa.npm,
        },
      },
    };

    if (userRole === "peserta") {
      // Peserta-specific data
      const bestScore =
        soal.submission.length > 0
          ? Math.max(...soal.submission.map((s: Submission) => s.score))
          : 0;

      const submissionCount = soal.submission.length;
      const canSubmit =
        !response.tugas.isOverdue &&
        submissionCount < soal.tugas.maksimalSubmit;

      response.userStats = {
        submissionCount,
        bestScore,
        canSubmit,
      };
    } else if (userRole === "asisten") {
      // Asisten-specific data
      const allSubmissions = soal.submission as SubmissionWithRelations[];
      const uniqueSubmitters = new Set(
        allSubmissions.map((s: SubmissionWithRelations) => s.peserta.idMahasiswa),
      ).size;

      // Get total peserta for this praktikum
      const totalPeserta = await prisma.pesertaPraktikum.count({
        where: { idPraktikum: praktikumId },
      });

      // Statistics by status
      const submissionStats = allSubmissions.reduce(
        (acc: { perfect: number; partial: number; failed: number }, sub: SubmissionWithRelations) => {
          const hasAccepted = sub.testCaseResult.some(
            (tcr: TestCaseResult) => tcr.status === "ACCEPTED",
          );
          const allAccepted = sub.testCaseResult.every(
            (tcr: TestCaseResult) => tcr.status === "ACCEPTED",
          );

          if (allAccepted) acc.perfect++;
          else if (hasAccepted) acc.partial++;
          else acc.failed++;

          return acc;
        },
        { perfect: 0, partial: 0, failed: 0 },
      );

      response.asistenStats = {
        totalSubmissions: allSubmissions.length,
        uniqueSubmitters,
        totalPeserta,
        participationRate: Math.round((uniqueSubmitters / totalPeserta) * 100),
        submissionStats,
        averageScore:
          allSubmissions.length > 0
            ? Math.round(
                allSubmissions.reduce(
                  (sum: number, s: Submission) => sum + s.score,
                  0,
                ) / allSubmissions.length,
              )
            : 0,
      };

      // Include test case details for asisten
      response.testCases = soal.testCase;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching soal detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; tugasId: string; soalId: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: praktikumId } = await params;
    const { tugasId: tugasId } = await params;
    const { soalId: soalId } = await params;

    // Verify user is asisten of this praktikum
    const asisten = await prisma.asistenPraktikum.findFirst({
      where: {
        idPraktikum: praktikumId,
        mahasiswa: { id: payload.id },
      },
    });

    if (!asisten) {
      return NextResponse.json(
        { error: "Unauthorized - Not an assistant" },
        { status: 403 },
      );
    }

    // Verify soal belongs to the tugas
    const existingSoal = await prisma.soal.findFirst({
      where: {
        id: soalId,
        idTugas: tugasId,
      },
    });

    if (!existingSoal) {
      return NextResponse.json({ error: "Soal not found" }, { status: 404 });
    }

    const requestData: UpdateSoalRequest = await request.json();

    // Update in transaction
    const result = await prisma.$transaction(async tx => {
      // Update soal
      const updatedSoal = await tx.soal.update({
        where: { id: soalId },
        data: {
          judul: requestData.judul,
          deskripsi: requestData.deskripsi,
          batasan: requestData.batasan || "",
          formatInput: requestData.formatInput || "",
          formatOutput: requestData.formatOutput || "",
          batasanMemoriKb: requestData.batasanMemoriKb,
          batasanWaktuEksekusiMs: requestData.batasanWaktuEksekusiMs,
          templateKode: requestData.templateKode || "",
          bobotNilai: requestData.bobotNilai,
        },
      });

      // Update contoh test cases
      if (requestData.contohTestCase) {
        // Delete existing contoh test cases
        await tx.contohTestCase.deleteMany({
          where: { idSoal: soalId },
        });

        // Create new contoh test cases
        if (requestData.contohTestCase.length > 0) {
          await tx.contohTestCase.createMany({
            data: requestData.contohTestCase.map((tc: ContohTestCase) => ({
              idSoal: soalId,
              contohInput: tc.contohInput || "",
              contohOutput: tc.contohOutput || "",
              penjelasanInput: tc.penjelasanInput || "",
              penjelasanOutput: tc.penjelasanOutput || "",
            })),
          });
        }
      }

      // Update test cases
      if (requestData.testCase) {
        // Delete existing test cases
        await tx.testCase.deleteMany({
          where: { idSoal: soalId },
        });

        // Create new test cases
        if (requestData.testCase.length > 0) {
          await tx.testCase.createMany({
            data: requestData.testCase.map((tc: TestCase) => ({
              idSoal: soalId,
              input: tc.input,
              outputDiharapkan: tc.outputDiharapkan,
            })),
          });
        }
      }

      return updatedSoal;
    });

    return NextResponse.json({
      message: "Soal updated successfully",
      soal: result,
    });
  } catch (error) {
    console.error("Error updating soal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ praktikumId: string; tugasId: string; soalId: string }>;
  },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const {  praktikumId } = await params;
    const {  soalId } = await params;

    // Verify user is asisten
    const asisten = await prisma.asistenPraktikum.findFirst({
      where: {
        idPraktikum: praktikumId,
        mahasiswa: { id: payload.id },
      },
    });

    if (!asisten) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete soal (cascade will handle related data)
    await prisma.soal.delete({
      where: { id: soalId },
    });

    return NextResponse.json({ message: "Soal deleted successfully" });
  } catch (error) {
    console.error("Error deleting soal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
