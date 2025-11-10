// app/api/mahasiswa/praktikum/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    const mahasiswaId = payload.id;

    //  Check apakah mahasiswa terdaftar
    const [pesertaCheck, asistenCheck] = await Promise.all([
      prisma.pesertaPraktikum.findFirst({
        where: {
          idPraktikum: praktikumId,
          idMahasiswa: mahasiswaId,
        },
      }),
      prisma.asistenPraktikum.findFirst({
        where: {
          idPraktikum: praktikumId,
          idMahasiswa: mahasiswaId,
        },
      }),
    ]);

    if (!pesertaCheck && !asistenCheck) {
      return NextResponse.json(
        { error: "Akses ditolak untuk praktikum ini" },
        { status: 403 },
      );
    }

    const userRole = asistenCheck ? "asisten" : "peserta";

    // Fetch detail praktikum sesuai schema
    const praktikum = await prisma.praktikum.findUnique({
      where: { id: praktikumId },
      include: {
        dosenPraktikum: {
          include: {
            dosen: {
              select: { nama: true, nip: true, email: true },
            },
          },
        },
        pesertaPraktikum: {
          include: {
            mahasiswa: {
              select: { nama: true, npm: true, email: true },
            },
          },
        },
        asistenPraktikum: {
          include: {
            mahasiswa: {
              select: { nama: true, npm: true, email: true },
            },
          },
        },
        tugas: {
          orderBy: { deadline: "desc" },
          include: {
            asisten: {
              include: {
                mahasiswa: {
                  select: { nama: true },
                },
              },
            },
            soal: {
              select: {
                id: true,
                judul: true,
                bobotNilai: true,
              },
            },
            hasilTugasMahasiswa: mahasiswaId && pesertaCheck ? {
              where: { idPeserta: pesertaCheck.id },
            } : false,
            // Untuk asisten: hitung submission count
            _count: {
              select: {
                hasilTugasMahasiswa: true,
              },
            },
          },
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            tugas: true,
          },
        },
      },
    });

    if (!praktikum) {
      return NextResponse.json(
        { error: "Praktikum not found" },
        { status: 404 },
      );
    }

    const getTotalSoalSubmitted = async (
      tugasId: string,
      pesertaId: string | null,
    ): Promise<number> => {
      if (userRole !== "peserta" || !pesertaId) {
        return 0;
      }
      const submittedSoalIds = await prisma.submission.findMany({
        where: {
          idPeserta: pesertaId,
          soal: {
            idTugas: tugasId,
          },
        },
        select: {
          idSoal: true,
        },
        distinct: ["idSoal"], // distinct
      });

      return submittedSoalIds.length;
    };

    // Format jam sesuai schema (DateTime -> HH:mm)
    const formatTime = (datetime: Date) => {
      return datetime.toTimeString().slice(0, 5);
    };

    const tugasData = await Promise.all(
      praktikum.tugas.map(async t => {
        const totalSoalSubmitted = await getTotalSoalSubmitted(
          t.id,
          pesertaCheck?.id || null,
        );
        return {
          id: t.id,
          judul: t.judul,
          deskripsi: t.deskripsi,
          deadline: t.deadline,
          maksimalSubmit: t.maksimalSubmit,
          createdAt: t.createdAt,
          pembuat: t.asisten.mahasiswa.nama,
          totalSoal: t.soal.length,
          totalSoalSubmitted,
          // Untuk asisten: jumlah yang sudah submit
          submissionCount: userRole === "asisten" ? t._count.hasilTugasMahasiswa : 0,
          // Status untuk peserta
          status:
            userRole === "peserta"
              ? t.hasilTugasMahasiswa?.[0]
                ? "submitted"
                : "not_submitted"
              : null,
        };
      }),
    );

    // format data
    const response = {
      id: praktikum.id,
      nama: praktikum.nama,
      kodePraktikum: praktikum.kodePraktikum,
      kodeMk: praktikum.kodeMk,
      kelas: praktikum.kelas,
      semester: praktikum.semester,
      tahun: praktikum.tahun,
      jadwalHari: praktikum.jadwalHari,
      jamMulai: formatTime(praktikum.jadwalJamMasuk),
      jamSelesai: formatTime(praktikum.jadwalJamSelesai),
      ruang: praktikum.ruang,
      userRole,
      dosen: praktikum.dosenPraktikum.map(dp => dp.dosen),
      peserta: praktikum.pesertaPraktikum.map(p => ({
        id: p.id,
        nama: p.mahasiswa.nama,
        npm: p.mahasiswa.npm,
        email: p.mahasiswa.email,
        joinedAt: p.createdAt,
      })),
      asisten: praktikum.asistenPraktikum.map(a => ({
        id: a.id,
        nama: a.mahasiswa.nama,
        npm: a.mahasiswa.npm,
        email: a.mahasiswa.email,
        joinedAt: a.createdAt,
      })),
      tugas: tugasData,
      stats: {
        totalPeserta: praktikum._count.pesertaPraktikum,
        totalAsisten: praktikum.asistenPraktikum.length,
        totalTugas: praktikum._count.tugas,
        completedTasks:
          userRole === "peserta"
            ? praktikum.tugas.filter(
              t => t.hasilTugasMahasiswa && t.hasilTugasMahasiswa.length > 0,
            ).length
            : 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching praktikum detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
