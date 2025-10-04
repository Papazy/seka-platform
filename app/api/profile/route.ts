import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/lib/enum";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 },
      );
    }

    const payload = await verifyToken(token);

    let data = null;

    switch (payload.role) {
      case UserRole.ADMIN:
        data = await prisma.admin.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            nama: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        break;
      case UserRole.LABORAN:
        data = await prisma.laboran.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            nama: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        break;
      case UserRole.DOSEN:
        data = await prisma.dosen.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            nama: true,
            email: true,
            nip: true,
            createdAt: true,
            updatedAt: true,
            jabatan: true,
            programStudi: {
              select: {
                id: true,
                nama: true,
                kodeProdi: true,
                fakultas: {
                  select: {
                    nama: true,
                    id: true,
                    kodeFakultas: true,
                  },
                },
              },
            },
          },
        });
        break;
      case UserRole.MAHASISWA:
        data = await prisma.mahasiswa.findUnique({
          where: { id: payload.id },
          select: {
            id: true,
            nama: true,
            email: true,
            npm: true,
            createdAt: true,
            updatedAt: true,
            programStudi: {
              select: {
                id: true,
                nama: true,
                kodeProdi: true,
                fakultas: {
                  select: {
                    id: true,
                    nama: true,
                    kodeFakultas: true,
                  },
                },
              },
            },
          },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Role tidak dikenali" },
          { status: 403 },
        );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        ...data,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil profil" },
      { status: 500 },
    );
  }
}
