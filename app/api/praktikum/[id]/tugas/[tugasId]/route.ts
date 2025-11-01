import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  updateTugas,
  verifyTugasAccess,
  getTugasById,
  deleteTugas,
} from "@/services/tugas.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const { id: praktikumId, tugasId } = await params;

    // Get tugas detail using service
    const result = await getTugasById(tugasId, praktikumId);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 404 });
    }

    return NextResponse.json({
      message: result.message,
      tugas: result.data,
    });
  } catch (error) {
    console.error("Error getting tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const { id: praktikumId, tugasId } = await params;

    // Verify access using service
    const accessCheck = await verifyTugasAccess(
      tugasId,
      praktikumId,
      userData.id,
    );
    if (!accessCheck.success) {
      const statusCode = accessCheck.error === "ACCESS_DENIED" ? 403 : 404;
      return NextResponse.json(
        { error: accessCheck.message },
        { status: statusCode },
      );
    }

    const body = await request.json();
    const { judul, deskripsi, deadline, maksimalSubmit, tugasBahasa } = body;

    // Update tugas using service
    const result = await updateTugas(tugasId, praktikumId, {
      judul,
      deskripsi,
      deadline,
      maksimalSubmit,
      tugasBahasa,
    });

    if (!result.success) {
      const statusCode = result.error === "TUGAS_NOT_FOUND" ? 404 : 400;
      return NextResponse.json(
        { error: result.message },
        { status: statusCode },
      );
    }

    return NextResponse.json({
      message: result.message,
      tugas: result.data,
    });
  } catch (error) {
    console.error("Error updating tugas di route:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const { id: praktikumId, tugasId } = await params;

    // Verify access using service
    const accessCheck = await verifyTugasAccess(
      tugasId,
      praktikumId,
      userData.id,
    );
    if (!accessCheck.success) {
      const statusCode = accessCheck.error === "ACCESS_DENIED" ? 403 : 404;
      return NextResponse.json(
        { error: accessCheck.message },
        { status: statusCode },
      );
    }

    // Delete tugas using service
    const result = await deleteTugas(tugasId, praktikumId);

    if (!result.success) {
      const statusCode = result.error === "HAS_SUBMISSIONS" ? 400 : 404;
      return NextResponse.json(
        { error: result.message },
        { status: statusCode },
      );
    }

    return NextResponse.json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error deleting tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
