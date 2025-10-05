import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idPraktikum } = await params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const type =
      (searchParams.get("type") as "peserta" | "asisten" | "dosen") ||
      "peserta";

    let csvContent = "";
    switch (type) {
      case "peserta":
        csvContent = "npm,nama,praktikum,kelas\n";
        break;
      case "asisten":
        csvContent = "npm,nama,praktikum,kelas\n";
        break;
      case "dosen":
        csvContent = "nip,nama,praktikum,kelas\n";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid type" }), {
          status: 400,
        });
    }

    let praktikumNama = "Praktikum Contoh Pemrograman";
    let praktikumKelas = "A";
    console.log("id praktikum: ", idPraktikum);
    if (idPraktikum) {
      const praktikum = await prisma.praktikum.findUnique({
        where: { id: idPraktikum },
        select: {
          nama: true,
          kelas: true,
        },
      });
      console.log("praktikum : ", praktikum);
      if (praktikum) {
        praktikumNama = praktikum.nama;
        praktikumKelas = praktikum.kelas;
      }
    }
    // contoh
    switch (type) {
      case "dosen":
        csvContent += `1234567890,Dr. Hafiz Alam,${praktikumNama},${praktikumKelas},\n`;
        csvContent += `1234567809,Rama Dhaniansyah,${praktikumNama},${praktikumKelas},\n`;
        break;
      default:
        csvContent += `2124107010001,Ahmad Rahman Hakim,${praktikumNama},${praktikumKelas}\n`;
        csvContent += `2124107010002,Siti Nurhaliza Putri,${praktikumNama},${praktikumKelas}\n`;
        csvContent += `2124107010003,Budi Santoso,${praktikumNama},${praktikumKelas}\n`;
        csvContent += `2124107010004,Fatimah Zahra,${praktikumNama},${praktikumKelas}\n`;
    }

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="template_' +
          type +
          "_praktikum_" +
          praktikumNama +
          "_" +
          praktikumKelas +
          '.csv"',
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
