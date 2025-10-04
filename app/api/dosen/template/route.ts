// app/api/laboran/dosen/template/route.ts
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

    const csvContent = `nip,nama,email,jabatan,programStudi
123456789,Dr. Ahmad,ahmad@usk.ac.id,Lektor,Informatika
123456788,Dr. Ismail,ismail@usk.ac.id,Asisten Ahli,Pendidikan Matematika
123456787,Prof. Aji,aji@usk.ac.id,Profesor,Informatika`;

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="template_dosen.csv"',
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
