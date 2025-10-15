import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSemester } from "../../utils";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") as "active" | "all") ?? "all";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("MASUK KESINI")
    const mahasiswaId = payload.id;
    const { semester, tahun } = await getCurrentSemester();

    const praktikumFilter =
      filter === "active"
        ? { semester: semester ?? 'GANJIL', tahun : tahun ?? 2003 }
        : {};

    const [pesertaPraktikum, asistenPraktikum] = await Promise.all([
      prisma.pesertaPraktikum.findMany({
        where: {
          idMahasiswa: mahasiswaId,
          praktikum: praktikumFilter,
        },
        include: { praktikum: true },
      }),
      prisma.asistenPraktikum.findMany({
        where: {
          idMahasiswa: mahasiswaId,
          praktikum: praktikumFilter,
        },
        include: { praktikum: true },
      }),
    ]);

    let dataPesertaPraktikum = {};
    if (pesertaPraktikum.length > 0) {
      dataPesertaPraktikum = pesertaPraktikum.map(peserta => ({
        role: "peserta",
        ...peserta.praktikum,
      }));
    }

    let dataAsistenPraktikum = {};
    if (asistenPraktikum.length > 0) {
      dataAsistenPraktikum = asistenPraktikum.map(asisten => ({
        role: "asisten",
        ...asisten.praktikum,
      }));
    }

    return NextResponse.json({
      praktikum: {
        peserta: dataPesertaPraktikum,
        asisten: dataAsistenPraktikum,
      },
    });
  } catch (error) {
    console.error("Error fetching praktikum data:", error);
    return NextResponse.json(
      { error: "Failed to fetch praktikum data" },
      { status: 500 },
    );
  }
}
