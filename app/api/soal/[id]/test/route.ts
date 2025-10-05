import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Get language info
    const bahasa = await prisma.bahasaPemrograman.findUnique({
      where: { id: languageId },
    });

    if (!bahasa) {
      return NextResponse.json(
        { error: "Language not found" },
        { status: 404 },
      );
    }

    // Use provided test cases or get from soal
    let finalTestCases = testCases;
    if (!finalTestCases) {
      const soal = await prisma.soal.findUnique({
        where: { id: soalId },
        include: {
          contohTestCase: true,
        },
      });

      if (!soal) {
        return NextResponse.json({ error: "Soal not found" }, { status: 404 });
      }

      finalTestCases = soal.contohTestCase
        .filter(tc => tc.contohOutput && tc.contohOutput !== "-")
        .map(tc => ({
          input: tc.contohInput,
          expected_output: tc.contohOutput,
        }));
    }

    // NEED TO HANDLE
    if (finalTestCases.length === 0) {
      return NextResponse.json(
        { error: "No test cases available" },
        { status: 400 },
      );
    }

    // Send to judge API
    const judgePayload = {
      code: sourceCode,
      test_cases: finalTestCases,
      language: bahasa.nama.toLowerCase(),
    };

    const judgeResponse = await fetch(`${process.env.JUDGE_API_URL}/judge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(judgePayload),
    });

    if (!judgeResponse.ok) {
      throw new Error("Judge API error");
    }

    const judgeResult = await judgeResponse.json();

    return NextResponse.json(judgeResult);
  } catch (error) {
    console.error("Error testing code:", error);
    return NextResponse.json({ error: "Failed to test code" }, { status: 500 });
  }
}
