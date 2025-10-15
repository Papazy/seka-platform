import { prisma } from "@/lib/prisma";
import { ServiceResponse } from "./utils";
import { submitToJudger } from "./judger.services";

export type submitSolutionType = {
    sourceCode: string;
    languageId: string;
    soalId: string;
}

export type JudgerPayload = {
    code: string;
    language: string;
    test_cases: {
        input: string;
        expected_output: string;
    }[];
    time_limit_ms?: number; // in milliseconds
    memory_limit_kb?: number; // in KB
}


const languageMap: Record<string, string> = {
    "c": "c",
    "cpp": "cpp",
    "c++": "cpp",
    "java": "java",
    "python": "python",
};




export const submitSolution = async (data: submitSolutionType) =>{
    const {sourceCode, languageId, soalId} = data;
    console.log("Data received in submitSolution:", data);
    if(!sourceCode || !languageId || !soalId){
        // console.log("data in submitSolution:", data);
        return ServiceResponse({success: false,error: "VALIDATION_ERROR",  message: "sourceCode, languageId, and soalId are required"});
    }

    // get test case, language
    try{
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
        ])

        if(!language){
            return ServiceResponse({success: false,error: "LANGUAGE_NOT_FOUND",  message: "Language not found"});
        }
        // gabungin
        const finalTestCases = [
            ...testCases,
            ...contohTestCases.map(tc => ({
            ...tc,
            input: tc.contohInput,
            outputDiharapkan: tc.contohOutput,
            }))
        ];
        console.log("finalTestcases found:", finalTestCases);
        if(!finalTestCases || finalTestCases.length === 0){
            return ServiceResponse({success: false,error: "TESTCASE_NOT_FOUND",  message: "No test cases found for this soal"});
        }

        const payload = {
            code: sourceCode,
            language: languageMap[language.nama.toLowerCase()] || language.nama.toLowerCase(),
            test_cases: finalTestCases.map((tc) => ({
                input: tc.input,
                expected_output: tc.outputDiharapkan,
            })),
            time_limit_ms: soal?.batasanWaktuEksekusiMs || 1000,
            memory_limit_kb: soal?.batasanMemoriKb || 65536,
        }

        const result = await submitToJudger(payload);
        console.log("Judger response:", result);
        return ServiceResponse({success: true, data: result, message: "Solution submitted successfully"});
    }catch(error){
        return ServiceResponse({success: false, error, message: "Failed to submit solution"});
    }
}


export const testSubmitSolution = async(payload: submitSolutionType) => {
    const {sourceCode, languageId, soalId} = payload;
    if(!sourceCode || !languageId || !soalId){
        // console.log("data in submitSolution:", data);
        return ServiceResponse({success: false,error: "VALIDATION_ERROR",  message: "sourceCode, languageId, and soalId are required"});
    }

    // get test case, language
    try{
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
        ])

        if(!language){
            return ServiceResponse({success: false,error: "LANGUAGE_NOT_FOUND",  message: "Language not found"});
        }
        // gabungin
        const finalTestCases = [
            ...testCases,
            ...contohTestCases.map(tc => ({
            ...tc,
            input: tc.contohInput,
            outputDiharapkan: tc.contohOutput,
            }))
        ];
        console.log("finalTestcases found:", finalTestCases);
        if(!finalTestCases || finalTestCases.length === 0){
            return ServiceResponse({success: false,error: "TESTCASE_NOT_FOUND",  message: "No test cases found for this soal"});
        }

        const payload = {
            code: sourceCode,
            language: languageMap[language.nama.toLowerCase()] || language.nama.toLowerCase(),
            test_cases: finalTestCases.map((tc) => ({
                input: tc.input,
                expected_output: tc.outputDiharapkan,
            })),
            time_limit_ms: soal?.batasanWaktuEksekusiMs || 1000,
            memory_limit_kb: soal?.batasanMemoriKb || 65536,
        }

        const result = await submitToJudger(payload);
        console.log("Judger response:", result);
        return ServiceResponse({success: true, data: result, message: "Solution submitted successfully"});
    }catch(error){
        return ServiceResponse({success: false, error, message: "Failed to submit solution"});
    }
}