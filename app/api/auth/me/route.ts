import { verifyToken } from "@/lib/auth";
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

    return NextResponse.json({
      message: "Data pengguna berhasil diambil",
      user: {
        id: payload.id,
        email: payload.email,
        nama: payload.nama,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data pengguna" },
      { status: 500 },
    );
  }
}
