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
  
  try{

    const result = await submitSolution({
      sourceCode: sourceCode,
      languageId: languageId,
      soalId: id
    })
    
    if(!result.success){
      return NextResponse.json({message: result.message, error: result.error}, {status: 400})
    }
    
    const submission = result.data;
    return NextResponse.json({result}, {status: 200})
  }catch(error){
    return NextResponse.json({message: "Internal Server Error", error}, {status: 500})
  }

    
}
