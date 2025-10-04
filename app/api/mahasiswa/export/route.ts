// app/api/laboran/mahasiswa/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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
      orderBy: { npm: "asc" },
    });

    // Generate CSV
    const csvHeader =
      "NPM,Nama,Email,Program Studi,Fakultas,Peserta Praktikum,Asisten Praktikum,Tanggal Daftar";
    const csvRows = mahasiswa.map(
      m =>
        `${m.npm},"${m.nama}","${m.email}","${m.programStudi.nama}","${m.programStudi.fakultas.nama}",${m._count.pesertaPraktikum},${m._count.asistenPraktikum},${m.createdAt.toISOString().split("T")[0]}`,
    );

    const csvContent = [csvHeader, ...csvRows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="mahasiswa_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting mahasiswa:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
