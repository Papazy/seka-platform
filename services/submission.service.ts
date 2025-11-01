import { prisma } from "@/lib/prisma";
import { ServiceResponse } from "./utils";
import { submitToJudger } from "./judger.services";
import {
  BahasaPemrograman,
  Soal,
  Submission,
  SubmissionStatus,
  SubmissionTugasStatus,
  TestCase,
  StatusCode,
} from "@prisma/client";

export type submitSolutionType = {
  sourceCode: string;
  languageId: string;
  soalId: string;
};

export type JudgerPayload = {
  code: string;
  language: string;
  test_cases: {
    input: string;
    expected_output: string;
  }[];
  time_limit_ms?: number; // in milliseconds
  memory_limit_kb?: number; // in KB
};

export interface TestResult {
  case_number: number;
  verdict: string;
  time_ms: number;
  memory_kb: number;
  input_data: string;
  expected_output: string;
  actual_output: string;
  error_message: any;
}

export interface JudgerResponse {
  verdict: string;
  score: number;
  total_cases: number;
  passed_cases: number;
  total_time_ms: number;
  max_time_ms: number;
  avg_time_ms: number;
  max_memory_kb: number;
  test_results: TestResult[];
  error_message: any;
  judged_at: string;
}

const languageMap: Record<string, string> = {
  c: "c",
  cpp: "cpp",
  "c++": "cpp",
  java: "java",
  python: "python",
};

export const testSubmitSolution = async (payload: submitSolutionType) => {
  const { sourceCode, languageId, soalId } = payload;
  if (!sourceCode || !languageId || !soalId) {
    // console.log("data in submitSolution:", data);
    return ServiceResponse({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Kode sumber, bahasa, dan ID soal wajib diisi",
    });
  }

  // get test case, language
  try {
    const [language, testCases, contohTestCases, soal] = await Promise.all([
      prisma.bahasaPemrograman.findUnique({
        where: { id: languageId },
      }),
      prisma.testCase.findMany({
        where: { idSoal: soalId },
      }),
      prisma.contohTestCase.findMany({
        where: { idSoal: soalId },
      }),
      prisma.soal.findUnique({
        where: { id: soalId },
      }),
    ]);

    if (!language) {
      return ServiceResponse({
        success: false,
        error: "LANGUAGE_NOT_FOUND",
        message: "Bahasa pemrograman tidak ditemukan",
      });
    }
    // gabungin
    const finalTestCases = [
      ...testCases,
      ...contohTestCases.map(tc => ({
        ...tc,
        input: tc.contohInput,
        outputDiharapkan: tc.contohOutput,
      })),
    ];
    console.log("finalTestcases found:", finalTestCases);
    if (!finalTestCases || finalTestCases.length === 0) {
      return ServiceResponse({
        success: false,
        error: "TESTCASE_NOT_FOUND",
        message: "Test case tidak ditemukan untuk soal ini",
      });
    }

    const payload = {
      code: sourceCode,
      language:
        languageMap[language.nama.toLowerCase()] || language.nama.toLowerCase(),
      test_cases: finalTestCases.map(tc => ({
        input: tc.input,
        expected_output: tc.outputDiharapkan,
      })),
      time_limit_ms: soal?.batasanWaktuEksekusiMs || 10000, // default 10s
      memory_limit_kb: soal?.batasanMemoriKb || 655360, // default 640MB
    };

    const result = await submitToJudger(payload);
    console.log("Judger response:", result);
    return ServiceResponse({
      success: true,
      data: result,
      message: "Submission berhasil disubmit",
    });
  } catch (error) {
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal mengirim solusi",
    });
  }
};

export const submitSolution = async (
  mahasiswaId: string,
  data: submitSolutionType,
) => {
  const { sourceCode, languageId, soalId } = data;
  console.log("Data received in submitSolution:", data);
  if (!sourceCode || !languageId || !soalId) {
    // console.log("data in submitSolution:", data);
    return ServiceResponse({
      success: false,
      error: "VALIDATION_ERROR",
      message: "Kode sumber, bahasa, dan ID soal wajib diisi",
    });
  }

  // get test case, language
  try {
    const [language, testCases, contohTestCases, soal] = await Promise.all([
      prisma.bahasaPemrograman.findUnique({
        where: { id: languageId },
      }),
      prisma.testCase.findMany({
        where: { idSoal: soalId },
      }),
      prisma.contohTestCase.findMany({
        where: { idSoal: soalId },
      }),
      prisma.soal.findUnique({
        where: { id: soalId },
      }),
    ]);

    if (!language) {
      return ServiceResponse({
        success: false,
        error: "LANGUAGE_NOT_FOUND",
        message: "Bahasa pemrograman tidak ditemukan",
      });
    }
    if (!soal) {
      return ServiceResponse({
        success: false,
        error: "SOAL_NOT_FOUND",
        message: "Soal tidak ditemukan",
      });
    }

    const tugas = await prisma.tugas.findUnique({
      where: { id: soal.idTugas },
    });
    if (!tugas) {
      return ServiceResponse({
        success: false,
        error: "TUGAS_NOT_FOUND",
        message: "Tugas tidak ditemukan untuk soal ini",
      });
    }

    if (new Date(tugas.deadline) < new Date()) {
      return ServiceResponse({
        success: false,
        error: "DEADLINE_EXCEEDED",
        message: "Batas waktu pengumpulan tugas ini telah terlewati",
      });
    }

    const pesertaPraktikum = await prisma.pesertaPraktikum.findFirst({
      where: {
        idMahasiswa: mahasiswaId,
        idPraktikum: tugas.idPraktikum,
      },
    });
    if (!pesertaPraktikum) {
      return ServiceResponse({
        success: false,
        error: "NOT_REGISTERED_ON_PRAKTIKUM",
        message:
          "Mahasiswa tidak ditemukan atau tidak terdaftar di praktikum untuk tugas ini",
      });
    }

    // gabungin
    const finalTestCases = [
      ...testCases,
      ...contohTestCases.map(tc => ({
        ...tc,
        input: tc.contohInput,
        outputDiharapkan: tc.contohOutput,
      })),
    ];
    console.log("finalTestcases found:", finalTestCases);
    if (!finalTestCases || finalTestCases.length === 0) {
      return ServiceResponse({
        success: false,
        error: "TESTCASE_NOT_FOUND",
        message: "Test case tidak ditemukan untuk soal ini",
      });
    }
    //simpan submission ke db
    const submission = await prisma.submission.create({
      data: {
        idSoal: soalId,
        idPeserta: pesertaPraktikum.id,
        idBahasa: languageId,
        sourceCode: sourceCode,
        statusJawaban: SubmissionTugasStatus.DISERAHKAN,
      },
    });

    processJudgerResult({
      submission,
      soal,
      judgerResponse: null,
      testCases: finalTestCases,
      language,
    });

    return ServiceResponse({
      success: true,
      data: "submitted",
      message: "Solusi berhasil dikirim",
    });
  } catch (error) {
    console.log("Error in submitSolution:", error);
    return ServiceResponse({
      success: false,
      error,
      message: "Gagal mengirim solusi",
    });
  }
};

const processJudgerResult = async ({
  submission,
  soal,
  judgerResponse,
  testCases,
  language,
}: {
  submission: Submission;
  soal: Soal;
  judgerResponse: JudgerResponse | null;
  testCases: TestCase[];
  language: BahasaPemrograman;
}) => {
  try {
    const payload = {
      code: submission.sourceCode,
      language:
        languageMap[language.nama.toLowerCase()] || language.nama.toLowerCase(),
      test_cases: testCases.map(tc => ({
        input: tc.input,
        expected_output: tc.outputDiharapkan,
      })),
      time_limit_ms: soal?.batasanWaktuEksekusiMs || 10000,
      memory_limit_kb: soal?.batasanMemoriKb || 655360,
    };

    const result = (await submitToJudger(payload)) as JudgerResponse;
    console.log("Judger response:", result);
    if (!result) {
      return ServiceResponse({
        success: false,
        error: "JUDGER_ERROR",
        message: "Respons tidak valid dari judger",
      });
    }

    // update submission dengan hasil dari judger
    // handle jika verdict CE
    let submissionStatus = "";
    switch (result.verdict) {
      case "CE":
        submissionStatus = SubmissionStatus.COMPILATION_ERROR;
        break;
      case "RTE":
        submissionStatus = SubmissionStatus.RUNTIME_ERROR;
        await saveTestCaseResults(
          submission.id,
          testCases,
          result.test_results,
        );
        break;
      case "TLE":
        submissionStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        await saveTestCaseResults(
          submission.id,
          testCases,
          result.test_results,
        );
        break;
      case "WA":
        submissionStatus = SubmissionStatus.WRONG_ANSWER;
        await saveTestCaseResults(
          submission.id,
          testCases,
          result.test_results,
        );
        break;
      case "AC":
        submissionStatus = SubmissionStatus.ACCEPTED;
        await saveTestCaseResults(
          submission.id,
          testCases,
          result.test_results,
        );
        break;
    }

    // hitung score
    const score = Math.round((result.passed_cases / result.total_cases) * 100);

    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: submissionStatus as SubmissionStatus,
        score: score,
        submittedAt: new Date(result.judged_at),
        statusCode: result.verdict as StatusCode,
      },
    });

    console.log("Submission updated with judger results:", updatedSubmission);
  } catch (error) {
    console.error("Failed to process judger result:", error);
  }
};

const saveTestCaseResults = async (
  submissionId: string,
  testCases: TestCase[],
  testCaseResults: TestResult[],
) => {
  try {
    if (!testCaseResults || testCaseResults.length === 0 || !submissionId) {
      console.log("testCaseResults", testCaseResults);
      console.log("submissionId", submissionId);

      throw new Error("Hasil test case atau ID submission tidak valid");
    }
    const finalTestCasesFormatted = testCaseResults.map((tcResult, index) => ({
      ...tcResult,
      testCaseId: testCases[index]?.id,
    }));
    const testCasesResultsData = await prisma.testCaseResult.createMany({
      data: finalTestCasesFormatted.map(tc => ({
        idSubmission: submissionId,
        idTestCase: tc.testCaseId,
        status: tc.verdict as SubmissionStatus,
        outputDihasilkan: tc.actual_output,
        waktuEksekusiMs: tc.time_ms,
        memoriKb: tc.memory_kb,
      })),
    });
    console.log("Test case results saved:", testCasesResultsData);
    return testCasesResultsData;
  } catch (error) {
    console.error("Failed to save test case results:", error);
  }
};
