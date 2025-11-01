// app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { error } from "console";
import { getTugasDataForMahasiswa } from "@/services/tugas.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    const { id: praktikumId, tugasId } = await params;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!tugasId || !praktikumId) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Atribut id (praktikumId) dan tugasId diperlukan",
        },
        { status: 400 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Forbidden" }, { status: 401 });
    }
    const mahasiswaId = payload.id;

    const serviceResponse = await getTugasDataForMahasiswa({
      praktikumId,
      tugasId,
      mahasiswaId,
    });
    if (!serviceResponse || !serviceResponse?.success) {
      console.log(serviceResponse);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: serviceResponse?.message || "Gagal mendapatkan data tugas",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(serviceResponse);
  } catch (error) {
    console.error("Error fetching tugas detail:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: `Terjadi kesalah pada server. ${error}`,
      },
      { status: 500 },
    );
  }
}

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string; tugasId: string }> },
// ) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = await verifyToken(token);
//     if (!payload) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     console.log("MASUK KESINI")

//     const { id: praktikumId } = await params;
//     const { tugasId: tugasId } = await params;
//     const mahasiswaId = payload.id;

//     //   Check akses ke praktikum
//     const [pesertaCheck, asistenCheck] = await Promise.all([
//       prisma.pesertaPraktikum.findFirst({
//         where: {
//           idPraktikum: praktikumId,
//           idMahasiswa: mahasiswaId,
//         },
//       }),
//       prisma.asistenPraktikum.findFirst({
//         where: {
//           idPraktikum: praktikumId,
//           idMahasiswa: mahasiswaId,
//         },
//       }),
//     ]);

//     if (!pesertaCheck && !asistenCheck) {
//       return NextResponse.json(
//         { error: "Access denied to this praktikum" },
//         { status: 403 },
//       );
//     }

//     const userRole = asistenCheck ? "asisten" : "peserta";
//     const pesertaId = pesertaCheck?.id;

//     //   Fetch detail tugas sesuai schema
//     const tugas = await prisma.tugas.findFirst({
//       where: {
//         id: tugasId,
//         idPraktikum: praktikumId,
//       },
//       include: {
//         praktikum: {
//           select: {
//             nama: true,
//             kodePraktikum: true,
//             kelas: true,
//             id: true,
//           },
//         },
//         asisten: {
//           include: {
//             mahasiswa: {
//               select: { nama: true, npm: true },
//             },
//           },
//         },
//         tugasBahasa: {
//           include: {
//             bahasa: true,
//           },
//         },
//         soal: {
//           orderBy: { id: "asc" },
//           include: {
//             contohTestCase: true,
//             testCase: true,
//             // Untuk peserta: ambil submission mereka saja
//             ...(userRole === "peserta" && {
//               submission: {
//                 where: { idPeserta: pesertaId },
//                 orderBy: { submittedAt: "desc" },
//                 include: {
//                   bahasa: {
//                     select: { nama: true, ekstensi: true },
//                   },
//                   testCaseResult: {
//                     include: {
//                       testCase: true,
//                     },
//                   },
//                 },
//               },
//             }),
//             // Untuk asisten: hitung total submission per soal
//             _count: {
//               select: {
//                 submission: true,
//               },
//             },
//           },
//         },
//         // Nilai tugas untuk peserta
//         ...(userRole === "peserta" && {
//           nilaiTugas: {
//             where: { idPeserta: pesertaId },
//             select: {
//               totalNilai: true,
//               createdAt: true,
//               updatedAt: true,
//             },
//           },
//         }),
//         // Stats untuk asisten
//         ...(userRole === "asisten" && {
//           _count: {
//             select: {
//               nilaiTugas: true,
//             },
//           },
//         }),
//       },
//     });
//     console.log("TUGAS:", tugas);
//     if (!tugas) {
//       return NextResponse.json({ error: "Tugas not found" }, { status: 404 });
//     }

//     //   Check deadline
//     const isOverdue = new Date() > new Date(tugas.deadline);

//     //   Calculate stats for asisten
//     let submissionStats = null;
//     if (userRole === "asisten") {
//       const allSubmissions = await prisma.submission.findMany({
//         where: {
//           soal: {
//             idTugas: tugasId,
//           },
//         },
//         include: {
//           peserta: {
//             include: {
//               mahasiswa: {
//                 select: { nama: true, npm: true },
//               },
//             },
//           },
//           soal: {
//             select: { judul: true, bobotNilai: true },
//           },
//         },
//       });

//       const uniqueSubmitters = new Set(allSubmissions.map(s => s.idPeserta));

//       submissionStats = {
//         totalSubmissions: allSubmissions.length,
//         uniqueSubmitters: uniqueSubmitters.size,
//         totalPeserta: await prisma.pesertaPraktikum.count({
//           where: { idPraktikum: praktikumId },
//         }),
//       };
//     }

//     //   Transform data untuk frontend
//     const response = {
//       id: tugas.id,
//       judul: tugas.judul,
//       deskripsi: tugas.deskripsi,
//       deadline: tugas.deadline,
//       maksimalSubmit: tugas.maksimalSubmit,
//       tugasBahasa: tugas.tugasBahasa,
//       createdAt: tugas.createdAt,
//       isOverdue,
//       userRole,
//       praktikum: tugas.praktikum,
//       pembuat: {
//         nama: tugas.asisten.mahasiswa.nama,
//         npm: tugas.asisten.mahasiswa.npm,
//       },
//       soal: tugas.soal.map(s => {
//         // Calculate user's best score for this soal (peserta only)
//         let bestSubmission = null;
//         let userSubmissions: any = [];

//         if (userRole === "peserta" && s.submission) {
//           userSubmissions = s.submission;
//           bestSubmission = s.submission.length > 0
//             ? s.submission.reduce((best, current) =>
//                 current.score > best.score ? current : best
//               )
//             : null;
//         }

//         return {
//           id: s.id,
//           judul: s.judul,
//           deskripsi: s.deskripsi,
//           batasan: s.batasan,
//           formatInput: s.formatInput,
//           formatOutput: s.formatOutput,
//           batasanMemoriKb: s.batasanMemoriKb,
//           batasanWaktuEksekusiMs: s.batasanWaktuEksekusiMs,
//           templateKode: s.templateKode,
//           bobotNilai: s.bobotNilai,
//           contohTestCase: s.contohTestCase.map(tc => ({
//             id: tc.id,
//             contohInput: tc.contohInput,
//             contohOutput: tc.contohOutput,
//             penjelasanInput: tc.penjelasanInput,
//             penjelasanOutput: tc.penjelasanOutput,
//           })),
//           totalTestCase: s.testCase.length,
//           // Untuk peserta
//           ...(userRole === "peserta" && {
//             userSubmissions: userSubmissions.map((sub: any) => ({
//               id: sub.id,
//               score: sub.score,
//               attemptNumber: sub.attemptNumber,
//               submittedAt: sub.submittedAt,
//               bahasa: sub.bahasa,
//               testCaseResults: sub.testCaseResult.map((tcr: any) => ({
//                 status: tcr.status,
//                 outputDihasilkan: tcr.outputDihasilkan,
//                 waktuEksekusiMs: tcr.waktuEksekusiMs,
//                 memoriKb: tcr.memoriKb,
//               })),
//             })),
//             bestScore: bestSubmission?.score || 0,
//             submissionCount: userSubmissions.length,
//             canSubmit:
//               userSubmissions.length < tugas.maksimalSubmit && !isOverdue,
//           }),
//           // Untuk asisten
//           ...(userRole === "asisten" && {
//             totalSubmissions: s._count.submission,
//           }),
//         };
//       }),
//       // Nilai total untuk peserta
//       ...(userRole === "peserta" && {
//         nilaiTugas: tugas.nilaiTugas?.[0] || null,
//         totalBobot: tugas.soal.reduce((sum, s) => sum + s.bobotNilai, 0),
//       }),
//       // Stats untuk asisten
//       ...(userRole === "asisten" && {
//         submissionStats,
//       }),
//     };

//     return NextResponse.json({data: response});
//   } catch (error) {
//     console.error("Error fetching tugas detail:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
