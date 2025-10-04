// app/api/laboran/dosen/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcrypt";

// app/api/laboran/dosen/route.ts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "LABORAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const dosen = await prisma.dosen.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: dosen });
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "LABORAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    // Cek apakah NIP atau email sudah ada
    const existingDosen = await prisma.dosen.findFirst({
      where: {
        OR: [{ nip: body.nip }, { email: body.email }],
      },
    });

    if (existingDosen) {
      return NextResponse.json(
        { error: "NIP atau email sudah digunakan" },
        { status: 400 },
      );
    }

    // Hash password default
    const hashedPassword = await bcrypt.hash("dosen123", 10);

    // Buat dosen baru
    const dosen = await prisma.dosen.create({
      data: {
        ...body,
        password: hashedPassword,
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

    return NextResponse.json({ data: dosen });
  } catch (error) {
    console.error("Error creating dosen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
