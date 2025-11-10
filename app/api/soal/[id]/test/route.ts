import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testSubmitSolution } from "@/services/submission.service";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: soalId } = await params;
    const { sourceCode, languageId, testCases } = await request.json();
    const token = request.cookies.get("token")?.value;

    if(!token){
      return NextResponse.json({ error: "Unauthorized"}, {status: 401});
    }

    if (!sourceCode || !languageId) {
      return NextResponse.json(
        { error: "Source code and language are required" },
        { status: 400 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mahasiswaId = payload.id;

    const judgeResult = await testSubmitSolution(mahasiswaId, {
      sourceCode,
      languageId,
      soalId,
    });

    return NextResponse.json(judgeResult);
  } catch (error) {
    console.error("Error testing code:", error);
    return NextResponse.json({ error: "Failed to test code" }, { status: 500 });
  }
}
