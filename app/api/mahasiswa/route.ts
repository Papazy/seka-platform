// app/api/laboran/mahasiswa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcrypt";

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

    const mahasiswa = await prisma.mahasiswa.findMany({
      include: {
        programStudi: {
          include: {
            fakultas: true,
          },
        },
        _count: {
          select: {
            pesertaPraktikum: true,
            asistenPraktikum: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: mahasiswa });
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
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
    const requiredFields = ["npm", "nama", "email", "programStudiId"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 },
        );
      }
    }

    // Cek apakah NPM atau email sudah ada
    const existingMahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        OR: [{ npm: body.npm }, { email: body.email }],
      },
    });

    if (existingMahasiswa) {
      return NextResponse.json(
        { error: "NPM atau email sudah digunakan" },
        { status: 400 },
      );
    }

    // Hash password default
    const hashedPassword = await bcrypt.hash("mahasiswa123", 10);

    // Buat mahasiswa baru
    const mahasiswa = await prisma.mahasiswa.create({
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
            pesertaPraktikum: true,
            asistenPraktikum: true,
          },
        },
      },
    });

    return NextResponse.json({ data: mahasiswa });
  } catch (error) {
    console.error("Error creating mahasiswa:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
