// app/api/laboran/praktikum/template/route.ts
import { NextRequest, NextResponse } from "next/server";
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

    const csvContent = `nama,kodePraktikum,kodeMk,kelas,semester,tahun,jadwalHari,jadwalJamMasuk,jadwalJamSelesai,ruang
Praktikum Algoritma dan Pemrograman,PRAK001,TIF101,A,GANJIL,2024,SENIN,08:00,10:00,Lab Komputer 1
Praktikum Struktur Data,PRAK002,TIF102,B,GANJIL,2024,SELASA,10:00,12:00,Lab Komputer 2
Praktikum Basis Data,PRAK003,TIF103,A,GENAP,2024,RABU,13:00,15:00,Lab Komputer 3`;

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="template_praktikum.csv"',
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
