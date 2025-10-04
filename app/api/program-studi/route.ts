import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/lib/enum";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyToken(token);

    // if (payload.role !== UserRole.ADMIN) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const programStudi = await prisma.programStudi.findMany({
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
      orderBy: { nama: "asc" },
    });

    return NextResponse.json({
      message: "Data program studi berhasil diambil",
      programStudi,
    });
  } catch (error) {
    console.error("Error fetching program studi:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
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

    if (!nama || !kodeProdi || !idFakultas) {
      return NextResponse.json(
        { error: "Nama, kode prodi, dan fakultas wajib diisi" },
        { status: 400 },
      );
    }

    // Check if program studi already exists
    const existingProdi = await prisma.programStudi.findFirst({
      where: {
        OR: [{ nama }, { kodeProdi }],
      },
    });

    if (existingProdi) {
      return NextResponse.json(
        { error: "Program studi atau kode prodi sudah exists" },
        { status: 400 },
      );
    }

    const newProgramStudi = await prisma.programStudi.create({
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

    return NextResponse.json(
      {
        message: "Program studi berhasil dibuat",
        programStudi: newProgramStudi,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating program studi:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
