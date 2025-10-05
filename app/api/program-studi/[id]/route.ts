// app/api/admin/program-studi/[id]/route.ts
import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/lib/enum";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (payload.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { nama, kodeProdi, idFakultas } = await req.json();
    const { id: programStudiId } = await params;

    if (!nama || !kodeProdi || !idFakultas) {
      return NextResponse.json(
        { error: "Nama, kode prodi, dan fakultas wajib diisi" },
        { status: 400 },
      );
    }

    // Check if program studi already exists (exclude current)
    const existingProdi = await prisma.programStudi.findFirst({
      where: {
        OR: [{ nama }, { kodeProdi }],
        NOT: { id: programStudiId },
      },
    });

    if (existingProdi) {
      return NextResponse.json(
        { error: "Program studi atau kode prodi sudah exists" },
        { status: 400 },
      );
    }

    const updatedProgramStudi = await prisma.programStudi.update({
      where: { id: programStudiId },
      data: {
        nama,
        kodeProdi,
        idFakultas,
      },
      include: {
        fakultas: {
          select: {
            id: true,
            nama: true,
            kodeFakultas: true,
          },
        },
        _count: {
          select: {
            mahasiswa: true,
            dosen: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Program studi berhasil diperbarui",
      programStudi: updatedProgramStudi,
    });
  } catch (error) {
    console.error("Error updating program studi:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (payload.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: programStudiId } = await params;

    // Check if program studi has students or lecturers
    const counts = await prisma.programStudi.findUnique({
      where: { id: programStudiId },
      include: {
        _count: {
          select: {
            mahasiswa: true,
            dosen: true,
          },
        },
      },
    });

    if (counts && (counts._count.mahasiswa > 0 || counts._count.dosen > 0)) {
      return NextResponse.json(
        {
          error: `Tidak dapat menghapus program studi ini karena masih memiliki ${counts._count.mahasiswa} mahasiswa dan ${counts._count.dosen} dosen`,
        },
        { status: 400 },
      );
    }

    await prisma.programStudi.delete({
      where: { id: programStudiId },
    });

    return NextResponse.json({
      message: "Program studi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting program studi:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
