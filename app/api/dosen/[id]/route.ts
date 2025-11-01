// app/api/dosen/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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
    if (!payload || payload.role !== "LABORAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: dosenId } = await params;

    const dosen = await prisma.dosen.findUnique({
      where: { id: dosenId },
      include: {
        programStudi: {
          include: {
            fakultas: true,
          },
        },
        _count: {
          select: {
            dosenPraktikum: true,
          },
        },
        dosenPraktikum: {
          include: {
            praktikum: {
              select: {
                id: true,
                nama: true,
                kodePraktikum: true,
                kelas: true,
                semester: true,
                tahun: true,
                jadwalHari: true,
                ruang: true,
                _count: {
                  select: {
                    pesertaPraktikum: true,
                    asistenPraktikum: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!dosen) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 },
      );
    }

    // Transform data untuk memudahkan akses di frontend
    const transformedData = {
      ...dosen,
      dosenPraktikum: dosen.dosenPraktikum.map(dp => ({
        id: dp.praktikum.id,
        nama: dp.praktikum.nama,
        kodePraktikum: dp.praktikum.kodePraktikum,
        kelas: dp.praktikum.kelas,
        semester: dp.praktikum.semester,
        tahun: dp.praktikum.tahun,
        jadwalHari: dp.praktikum.jadwalHari,
        ruang: dp.praktikum.ruang,
        _count: dp.praktikum._count,
        joinedAt: dp.createdAt,
      })),
    };

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "LABORAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: dosenId } = await params;
    const body = await request.json();

    // Validasi input
    const requiredFields = [
      "nip",
      "nama",
      "email",
      "jabatan",
      "programStudiId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 },
        );
      }
    }

    // Cek apakah dosen exists
    const existingDosen = await prisma.dosen.findUnique({
      where: { id: dosenId },
    });

    if (!existingDosen) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek apakah NIP atau email sudah digunakan oleh dosen lain
    const duplicateDosen = await prisma.dosen.findFirst({
      where: {
        AND: [
          { id: { not: dosenId } },
          {
            OR: [{ nip: body.nip }, { email: body.email }],
          },
        ],
      },
    });

    if (duplicateDosen) {
      if (duplicateDosen.nip === body.nip) {
        return NextResponse.json(
          { error: "NIP sudah digunakan" },
          { status: 400 },
        );
      }
      if (duplicateDosen.email === body.email) {
        return NextResponse.json(
          { error: "Email sudah digunakan" },
          { status: 400 },
        );
      }
    }

    // Cek apakah program studi exists
    const programStudi = await prisma.programStudi.findUnique({
      where: { id: body.programStudiId },
    });

    if (!programStudi) {
      return NextResponse.json(
        { error: "Program studi tidak ditemukan" },
        { status: 400 },
      );
    }

    // Update dosen
    const updatedDosen = await prisma.dosen.update({
      where: { id: dosenId },
      data: {
        nip: body.nip,
        nama: body.nama,
        email: body.email,
        jabatan: body.jabatan,
        programStudiId: body.programStudiId,
      },
      include: {
        programStudi: {
          include: {
            fakultas: true,
          },
        },
        _count: {
          select: {
            dosenPraktikum: true,
          },
        },
      },
    });

    return NextResponse.json({ data: updatedDosen });
  } catch (error) {
    console.error("Error updating dosen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "LABORAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: dosenId } = await params;

    // Cek apakah dosen exists
    const existingDosen = await prisma.dosen.findUnique({
      where: { id: dosenId },
      include: {
        _count: {
          select: {
            dosenPraktikum: true,
          },
        },
      },
    });

    if (!existingDosen) {
      return NextResponse.json(
        { error: "Dosen tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek apakah dosen masih mengajar praktikum
    if (existingDosen._count.dosenPraktikum > 0) {
      return NextResponse.json(
        {
          error: "Tidak dapat menghapus dosen yang masih mengajar praktikum",
        },
        { status: 400 },
      );
    }

    // Delete dosen
    await prisma.dosen.delete({
      where: { id: dosenId },
    });

    return NextResponse.json({ message: "Dosen berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting dosen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
