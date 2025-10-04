import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idPraktikum } = await params;
  const { userIds, type } = await req.json();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const praktikum = await prisma.praktikum.findUnique({
      where: { id: idPraktikum },
      select: {
        id: true,
        nama: true,
        kelas: true,
      },
    });

    if (!praktikum) {
      return NextResponse.json(
        { error: "Praktikum not found" },
        { status: 404 },
      );
    }

    let deleteResult;

    switch (type) {
      case "peserta":
        console.log("menghapus peserta ...");
        console.log("UserIDS : ", userIds);
        try {
          deleteResult = await prisma.pesertaPraktikum.deleteMany({
            where: {
              idPraktikum: praktikum.id,
              idMahasiswa: { in: userIds },
            },
          });
        } catch (error) {
          console.error("Error deleting peserta:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }
        break;
      case "asisten":
        try {
          deleteResult = await prisma.asistenPraktikum.deleteMany({
            where: {
              idPraktikum: praktikum.id,
              idMahasiswa: { in: userIds },
            },
          });
        } catch (error) {
          console.error("Error deleting peserta:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }
        break;
      case "dosen":
        try {
          deleteResult = await prisma.dosenPraktikum.deleteMany({
            where: {
              idPraktikum: praktikum.id,
              idDosen: { in: userIds },
            },
          });
        } catch (error) {
          console.error("Error deleting peserta:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
          );
        }
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(
      { message: `Berhasil menghapus ${type}`, _count: deleteResult.count },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error deleting ${type}: `, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
