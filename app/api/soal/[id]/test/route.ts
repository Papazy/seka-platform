import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testSubmitSolution } from "@/services/submission.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: soalId } = await params;
    const { sourceCode, languageId, testCases } = await request.json();

    if (!sourceCode || !languageId) {
      return NextResponse.json(
        { error: "Source code and language are required" },
        { status: 400 },
      );
    }

   const judgeResult = await testSubmitSolution({
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
