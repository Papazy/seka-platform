import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { userIds, type } = await req.json();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dataToAdd = userIds.map((userId: string) => ({
      idPraktikum: id,
      [type === "dosen" ? "idDosen" : "idMahasiswa"]: userId,
    }));
    let data;

    switch (type) {
      case "peserta":
        data = await prisma.pesertaPraktikum.createMany({
          data: dataToAdd,
        });
        break;
      case "asisten":
        data = await prisma.asistenPraktikum.createMany({
          data: dataToAdd,
        });
        break;
      case "dosen":
        data = await prisma.dosenPraktikum.createMany({
          data: dataToAdd,
        });
        break;
    }

    return NextResponse.json(
      { message: `Berhasil menambahkan ${type}`, data, _count: data?.count },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error menambahkan ${type} : `, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
