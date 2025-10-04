import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tugasId: string }> },
) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const praktikumId = params.id;
    const tugasId = params.tugasId;

    // Check if user is asisten for this praktikum
    const asisten = await prisma.asistenPraktikum.findFirst({
      where: {
        idMahasiswa: userData.id,
        idPraktikum: praktikumId,
      },
    });

    if (!asisten) {
      return NextResponse.json(
        { error: "Access denied. Only asisten can edit tugas." },
        { status: 403 },
      );
    }

    // Check if tugas exists and belongs to this praktikum
    const existingTugas = await prisma.tugas.findFirst({
      where: {
        id: tugasId,
        idPraktikum: praktikumId,
      },
    });

    if (!existingTugas) {
      return NextResponse.json({ error: "Tugas not found" }, { status: 404 });
    }

    const body = await request.json();
    const { judul, deskripsi, deadline, maksimalSubmit } = body;

    // Validation
    if (!judul || !deskripsi || !deadline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return NextResponse.json(
        { error: "Deadline must be in the future" },
        { status: 400 },
      );
    }

    // update Tugas Bahasa
    if (body.tugasBahasa && Array.isArray(body.tugasBahasa)) {
      const tugasBahasaData = body.tugasBahasa.map((id: string) => ({
        idTugas: tugasId,
        idBahasa: id,
      }));

      // Delete existing tugasBahasa
      await prisma.tugasBahasa.deleteMany({
        where: { idTugas: tugasId },
      });

      // Create new tugasBahasa
      await prisma.tugasBahasa.createMany({
        data: tugasBahasaData,
      });
    }

    // Update tugas
    const updatedTugas = await prisma.tugas.update({
      where: { id: tugasId },
      data: {
        judul,
        deskripsi,
        deadline: deadlineDate,
        maksimalSubmit: maksimalSubmit || 3,
      },
      include: {
        praktikum: {
          select: {
            nama: true,
            kodePraktikum: true,
            kelas: true,
          },
        },
        asisten: {
          include: {
            mahasiswa: {
              select: {
                nama: true,
                npm: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Tugas updated successfully",
      tugas: {
        id: updatedTugas.id,
        judul: updatedTugas.judul,
        deskripsi: updatedTugas.deskripsi,
        deadline: updatedTugas.deadline.toISOString(),
        maksimalSubmit: updatedTugas.maksimalSubmit,
        praktikum: updatedTugas.praktikum,
        pembuat: updatedTugas.asisten.mahasiswa,
      },
    });
  } catch (error) {
    console.error("Error updating tugas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
