import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { StatusSubmissionTugas } from "@/lib/enum";
import { submitSolution } from "@/services/submission.service";

interface JudgeResult {
  passed: boolean;
  status: string;
  execution_time: number;
  actual_output: string;
}

interface SubmissionRequestBody {
  sourceCode: string;
  languageId: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body: SubmissionRequestBody = await request.json();
  const { sourceCode, languageId } = body;
  const { id } = await params;

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log("payload", payload);
  const mahasiswaId = payload.id;

  try {
    const result = await submitSolution(mahasiswaId, {
      sourceCode: sourceCode,
      languageId: languageId,
      soalId: id,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message, error: result.error },
        { status: 400 },
      );
    }

    const submission = result.data;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
