import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: soalId } = await params;
    const soal = await prisma.soal.findUnique({
      where: {
        id: soalId,
      },
      include: {
        contohTestCase: true,
      },
    });

    return NextResponse.json(soal || { error: "Soal not found" }, {
      status: soal ? 200 : 404,
    });
  } catch (error) {
    console.error(error || "Error fetching soal");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
