"use client";
import { useSoal } from "@/hooks/useSoal";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bahasa, useBahasa } from "@/hooks/useBahasa";
import toast from "react-hot-toast";
import { Clipboard, Edit } from "lucide-react";
import { useBahasaTugas } from "@/hooks/useBahasaTugas";
import { Button } from "@/components/ui/button";
import { useSubmissionsSoalMahasiswa } from "@/hooks/useSubmissionsSoalMahasiswa";
import { Submission } from "@/types/submission";
import { useRolePraktikum } from "@/contexts/RolePraktikumContext";
import AsistenSubmissions from "@/components/AsistenSubmission";
import TopScoreSidebar from "@/components/TopScoreSidebar";

export interface TestResultResponse {
  success: boolean
  data: Data
  message: string
}

export interface Data {
  verdict: string
  score: number
  total_cases: number
  passed_cases: number
  total_time_ms: number
  max_time_ms: number
  avg_time_ms: number
  max_memory_kb: number
  test_results: TestResult[]
  error_message: any
  judged_at: string
}

export interface TestResult {
  case_number: number
  verdict: string
  time_ms: number
  memory_kb: number
  input_data: string
  expected_output: string
  actual_output: string
  error_message: any
}


export type RolePraktikum = "ASISTEN" | "PESERTA";

interface TopScore {
  rank: number;
  nama: string;
  npm: string;
  score: number;
  submittedAt: string;
}

export default function SoalPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"soal" | "submission">("soal");
  const router = useRouter();

  const { data: soalData, isLoading: soalLoading } = useSoal(
    params.soalId as string,
  );
  const { data: bahasaData, isLoading: bahasaLoading } = useBahasaTugas(
    params.tugasId as string,
  );
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    refetch: refetchSubmission,
  } = useSubmissionsSoalMahasiswa(params.soalId as string);

  const { isAsisten } = useRolePraktikum();
  const [role, setRole] = useState<RolePraktikum>("PESERTA");

  useEffect(() => {
    if (isAsisten(params.id as string)) {
      setRole("ASISTEN");
    }
  }, [isAsisten, params.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex p-4 gap-4 h-screen">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg">
          {role === "ASISTEN" ? (
            activeTab === "soal" ? (
              <div className=" flex flex-col">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeTab === "soal"
                      ? soalData?.judul || "Loading..."
                      : "Riwayat Submission"}
                  </h2>
                  {role === "ASISTEN" && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}/edit`,
                        )
                      }
                      className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
                    >
                      <Edit /> Edit
                    </Button>
                  )}
                </div>

                <div className="flex-1 px-6 py-4">
                  <SoalContent soal={soalData} />
                </div>
              </div>
            ) : (
              <AsistenSubmissions
                praktikumId={params.id as string}
                tugasId={params.tugasId as string}
                soalId={params.soalId as string}
              />
            )
          ) : soalLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <ContentArea
              activeTab={activeTab}
              soal={soalData}
              submissions={submissionsData}
              submissionsLoading={submissionsLoading}
              role={role}
              params={{
                id: params.id as string,
                tugasId: params.tugasId as string,
                soalId: params.soalId as string,
              }}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-96 flex-shrink-0">
          {bahasaLoading ? (
            <div className="bg-white animate-pulse p-5 rounded-lg border h-32">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <RightSidebar
              activeTab={activeTab}
              bahasa={bahasaData || []}
              soal={soalData}
              refetchSubmission={refetchSubmission}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Left Sidebar
const LeftSidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "soal" | "submission";
  setActiveTab: (tab: "soal" | "submission") => void;
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">Menu Soal</h2>
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-600 hover:text-gray-900 border rounded px-2 py-1 hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("soal")}
          className={`w-full text-sm text-left px-3 py-2 rounded ${
            activeTab === "soal"
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Soal
        </button>
        <button
          onClick={() => setActiveTab("submission")}
          className={`w-full text-sm text-left px-3 py-2 rounded ${
            activeTab === "submission"
              ? "bg-blue-100 text-blue-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Submission
        </button>
      </nav>
    </div>
  );
};

// Content Area
const ContentArea = ({
  activeTab,
  soal,
  submissions,
  submissionsLoading,
  role,
  params
}: {
  activeTab: "soal" | "submission";
  soal: any;
  submissions?: Submission[];
  submissionsLoading: boolean;
  role: RolePraktikum;
  params: { id: string; tugasId: string; soalId: string };
}) => {
  const router = useRouter();

  return (
    <div className=" flex flex-col">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {activeTab === "soal"
            ? soal?.judul || "Loading..."
            : "Riwayat Submission"}
        </h2>
        {role === "ASISTEN" && (
          <Button
            onClick={() =>
              router.push(
                `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}/edit`,
              )
            }
            className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
          >
            <Edit /> Edit
          </Button>
        )}
      </div>

      <div className="flex-1 px-6 py-4">
        {activeTab === "soal" ? (
          <SoalContent soal={soal} />
        ) : (
          <SubmissionContent
            submissions={submissions}
            submissionsLoading={submissionsLoading}
          />
        )}
      </div>
    </div>
  );
};

// Soal Content
const SoalContent = ({ soal }: { soal: any }) => {
  if (!soal) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Problem Description Skeleton */}
        <section>
          <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </section>

        {/* Input Format Skeleton */}
        <section>
          <div className="h-4 bg-gray-200 rounded mb-3 w-32"></div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* Output Format Skeleton */}
        <section>
          <div className="h-4 bg-gray-200 rounded mb-3 w-36"></div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* Constraints Skeleton */}
        <section>
          <div className="h-4 bg-gray-200 rounded mb-3 w-20"></div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* Sample Test Cases Skeleton */}
        <section>
          <div className="h-4 bg-gray-200 rounded mb-3 w-40"></div>
          <div className="space-y-4">
            {[1, 2].map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-16"></div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-3">
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problem Description */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Deskripsi</h3>
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer content={soal.deskripsi} />
        </div>
      </section>

      {/* Input Format */}
      {soal.formatInput && soal.formatInput.trim() !== "-" && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Format Input
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {soal.formatInput}
            </pre>
          </div>
        </section>
      )}

      {/* Output Format */}
      {soal.formatOutput && soal.formatOutput.trim() !== "-" && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Format Output
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {soal.formatOutput}
            </pre>
          </div>
        </section>
      )}

      {/* Constraints */}
      {soal.batasan && soal.batasan.trim() !== "-" && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Batasan</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <pre className="text-sm text-red-800 whitespace-pre-wrap">
              {soal.batasan}
            </pre>
          </div>
        </section>
      )}

      {/* Sample Test Cases */}
      {soal.contohTestCase && soal.contohTestCase.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Contoh Test Case
          </h3>
          <div className="space-y-4">
            {soal.contohTestCase.map((tc: any, idx: number) => {
              if (!tc.contohOutput || tc.contohOutput === "-") return null;
              const handleCopy = async (text: string, label: string) => {
                try {
                  await navigator.clipboard.writeText(text);
                  toast.success(`${label} berhasil disalin`);
                } catch {
                  toast.error(`Gagal menyalin ${label}`);
                }
              };

              return (
                <div key={tc.id} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                    <h4 className="font-medium text-sm text-gray-900">
                      Test Case #{idx + 1}
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Input:
                          </label>
                          <Button
                            variant="outline"
                            onClick={() => handleCopy(tc.contohInput, "Input")}
                            className="text-gray-500 hover:text-green-700 flex items-center gap-1 text-xs"
                            title="Copy Input"
                          >
                            <Clipboard className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                          <pre className="text-sm font-mono text-gray-800">
                            {tc.contohInput}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-2">
                            Output:
                          </label>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleCopy(tc.contohOutput, "Output")
                            }
                            className="text-gray-500 hover:text-green-700 flex items-center gap-1 text-xs"
                            title="Copy Output"
                          >
                            <Clipboard className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                          <pre className="text-sm font-mono text-gray-800">
                            {tc.contohOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                    {tc.penjelasanInput &&
                      tc.penjelasanInput.trim() !== "-" && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-sm text-yellow-800">
                            {tc.penjelasanInput}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

// Right Sidebar
const RightSidebar = ({
  bahasa,
  soal,
  activeTab,
  setActiveTab,
  refetchSubmission,
}: {
  bahasa: Bahasa[];
  soal?: any;
  activeTab: "soal" | "submission";
  setActiveTab: (tab: "submission" | "soal") => void;
  refetchSubmission: () => void;
}) => {
  return activeTab === "soal" ? (
    <SubmitJawabanSidebar
      bahasa={bahasa}
      soal={soal}
      setActiveTab={setActiveTab}
      refetchSubmission={refetchSubmission}
    />
  ) : (
    <TopScoreSidebar soalId={soal.id as string} />
  );
};

// Submit Jawaban Sidebar
const SubmitJawabanSidebar = ({
  bahasa,
  soal,
  setActiveTab,
  refetchSubmission,
}: {
  bahasa: Bahasa[];
  soal?: any;
  setActiveTab: (tab: "submission" | "soal") => void;
  refetchSubmission: () => void;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<TestResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collapse states
  const [isTemplateExpanded, setIsTemplateExpanded] = useState(true);
  const [isSubmitExpanded, setIsSubmitExpanded] = useState(true);
  const [isResultExpanded, setIsResultExpanded] = useState(true);

  // Set default language when data loads
  useEffect(() => {
    if (bahasa.length > 0 && !selectedLanguage) {
      const cppLang =
        bahasa.find(b => b.nama.toLowerCase().includes("c++")) || bahasa[0];
      setSelectedLanguage(cppLang.id.toString());
    }
  }, [bahasa]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File ${file.name} berhasil dipilih`);
    }
  };

  // Copy template code to clipboard
  const handleCopyTemplate = async () => {
    if (soal?.templateKode && soal.templateKode !== "-") {
      try {
        await navigator.clipboard.writeText(soal.templateKode);
        toast.success("Template code berhasil disalin ke clipboard");
      } catch (err) {
        toast.error("Gagal menyalin template code");
      }
    }
  };

  // Handle test
  const handleTest = async () => {
    if (!uploadedFile) {
      toast.error("Silakan uplod filter terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      // read text file
      const fileContent = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.readAsText(uploadedFile);
      });

      const response = await fetch(`/api/soal/${soal.id}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: fileContent,
          languageId: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal eksekusi kode");
      }

      const result = await response.json();
      console.log("testResult", (result));
      setTestResult(result);
      toast.success("Tes berhasil dijalankan");
    } catch (error) {
      console.error(error || "Gagal tes kode");
      toast.error(error instanceof Error ? error?.message : "Gagal tes kode");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error("Silakan pilih file terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      const fileContent = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.readAsText(uploadedFile);
      });

      const response = await fetch(`/api/soal/${soal.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: fileContent,
          languageId: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submit failed");
      }

      // Handle successful submission
      refetchSubmission();
      const result = await response.json();
      toast.success(`Submit berhasil! Score: ${result.score}`);

      // Reset form
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setActiveTab("submission");
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal submit jawaban",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template Code Section */}
      {soal?.templateKode && soal.templateKode !== "-" && (
        <div className="bg-white rounded-lg border border-green-200">
          <button
            onClick={() => setIsTemplateExpanded(!isTemplateExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-green-100 rounded-t-lg transition-colors"
          >
            <h2 className="text-base font-medium text-gray-800">
              Template Code
            </h2>
            <span className="text-gray-700 text-sm">
              {isTemplateExpanded ? "−" : "+"}
            </span>
          </button>

          {isTemplateExpanded && (
            <div className="border-t border-green-200 p-4">
              <div className="mb-3">
                <button
                  onClick={handleCopyTemplate}
                  className="text-sm text-green-700 hover:text-gray-800 font-medium"
                >
                  Copy Template
                </button>
              </div>
              <pre className="w-full px-3 py-2 border border-green-200 rounded-lg bg-white text-sm font-mono overflow-x-auto text-gray-700">
                {soal.templateKode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Submit Section */}
      <div className="bg-white rounded-lg border border-green-200">
        <button
          onClick={() => setIsSubmitExpanded(!isSubmitExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-green-100 rounded-t-lg transition-colors"
        >
          <h2 className="text-base font-medium text-gray-800">
            Submit Jawaban
          </h2>
          <span className="text-gray-700 text-sm">
            {isSubmitExpanded ? "−" : "+"}
          </span>
        </button>

        {isSubmitExpanded && (
          <div className="border-t border-green-200 p-4 space-y-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Bahasa Pemrograman
              </label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm bg-white"
              >
                {bahasa.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.nama} ({b.compiler} {b.versi})
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Upload File Source Code
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".cpp,.c,.py,.java,.js,.ts"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />

              {uploadedFile && (
                <div className="mt-2 text-sm text-green-700">
                  File: {uploadedFile.name}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleTest}
                disabled={isLoading || !uploadedFile}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {isLoading ? "Running..." : "Tes Kode"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !uploadedFile}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Submit Jawaban
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-sm text-green-700">
              {testResult ? "Testing kode..." : "Processing..."}
            </span>
          </div>
        </div>
      )}

      {/* Test Results Section */}
      {testResult && !isLoading && (
        <div className="bg-white rounded-lg border border-green-200">
          <button
            onClick={() => setIsResultExpanded(!isResultExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-green-100 rounded-t-lg transition-colors"
          >
            <h3 className="text-base font-medium text-gray-800">Hasil Test</h3>
            <span className="text-gray-700 text-sm">
              {isResultExpanded ? "−" : "+"}
            </span>
          </button>

          {isResultExpanded && (
            <div className="border-t border-green-200 p-4 space-y-4">
              {/* Status Summary */}
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      testResult.data.verdict === "AC"
                        ? "bg-green-100 text-gray-800"
                        : testResult.data.verdict === "CE"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testResult.data.verdict === "AC" || testResult.data.verdict === "WA"
                      ? "Selesai"
                      : testResult.data.verdict === "CE"
                        ? "Compile Error"
                        : "Runtime Error"}
                  </span>
                </div>
                {(testResult.data.verdict === "AC" || testResult.data.verdict === "WA") && (
                  <div className="text-sm text-gray-700">
                    Test Case: {testResult.data.passed_cases}/
                    {testResult.data.total_cases} berhasil
                  </div>
                )}
              </div>

              {/* Error Message */}
              {testResult.message && !testResult.success && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Error:
                  </h4>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
                    {testResult.message}
                  </pre>
                </div>
              )}

              {/* Test Cases Results */}
              {testResult.data.test_results && testResult.data.test_results.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">
                    Detail Test Cases:
                  </h4>
                  {testResult.data.test_results.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        result.verdict === "AC"
                          ? "border-green-200 bg-white"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          Test Case {index + 1}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              result.verdict === "AC"
                                ? "bg-green-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.verdict === "AC" ? "PASS" : "FAIL"}
                          </span>
                          <span className="text-xs text-gray-700">
                            {result.time_ms}ms
                          </span>
                            <span className="text-xs text-gray-700">
                            {(result.memory_kb / 1024).toFixed(2)}MB
                            </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-green-700">
                            Input:
                          </span>
                          <pre className="bg-white p-2 rounded border border-green-100 mt-1 overflow-x-auto">
                            {result.input_data}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">
                            Expected:
                          </span>
                          <pre className="bg-white p-2 rounded border border-green-100 mt-1 overflow-x-auto">
                            {result.expected_output}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">
                            Actual:
                          </span>
                          <pre
                            className={`p-2 rounded border mt-1 overflow-x-auto ${
                              result.verdict === "AC"
                                ? "bg-green-50 border-green-100"
                                : "bg-red-50 border-red-200"
                            }`}
                          >
                            {result.actual_output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Top Score Sidebar with Real Data

// Submission Content with Real Data
const SubmissionContent = ({
  submissions,
  submissionsLoading,
}: {
  submissions?: Submission[];
  submissionsLoading: boolean;
}) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [currentView, setCurrentView] = useState("list");

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      ACCEPTED: "AC",
      WRONG_ANSWER: "WA",
      TIME_LIMIT_EXCEEDED: "TLE",
      COMPILATION_ERROR: "CE",
      RUNTIME_ERROR: "RE",
      PARTIAL: "PA",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      ACCEPTED: "bg-green-600 text-white",
      WRONG_ANSWER: "bg-red-600 text-white",
      TIME_LIMIT_EXCEEDED: "bg-orange-600 text-white",
      COMPILATION_ERROR: "bg-purple-600 text-white",
      RUNTIME_ERROR: "bg-pink-600 text-white",
      PARTIAL: "bg-yellow-600 text-white",
    };
    return colorMap[status] || "bg-gray-600 text-white";
  };

  if (submissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (currentView === "detail" && selectedSubmission) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setCurrentView("list")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mb-4"
          >
            Kembali
          </button>
          <h3 className="text-base font-semibold">
            Submission #{selectedSubmission.id}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Submitted:{" "}
            {new Date(selectedSubmission.submittedAt).toLocaleString("id-ID")} |
            Language: {selectedSubmission.bahasa.nama} |
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score & Test Results */}
          <div className="border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h4 className="font-semibold">Score & Results</h4>
            </div>
            <div className="p-4">
              <div className="text-xl font-bold mb-4">
                {selectedSubmission.score}/100
              </div>
              <div className="space-y-2">
                {selectedSubmission.testCaseResult.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-xs">Test #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusColor(result.status)}`}
                      >
                        {getStatusText(result.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.waktuEksekusiMs}ms | {result.memoriKb} kb
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Source Code */}
          <div className="border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h4 className="font-semibold">Source Code</h4>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 text-gray-100 rounded overflow-x-auto">
                <div className="bg-gray-800 px-4 py-2 text-xs border-b border-gray-700">
                  {selectedSubmission.bahasa.nama}
                </div>
                <pre className="p-4 text-xs leading-relaxed">
                  <code>{selectedSubmission.sourceCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold mb-4">Submissions</h3>

      {submissions?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Belum ada submission</p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  At
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Lang
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Verdict
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions?.map(submission => {
                const verdict = submission.testCaseResult.every(
                  r => r.status === "ACCEPTED",
                )
                  ? "ACCEPTED"
                  : submission.testCaseResult.some(r => r.status === "ACCEPTED")
                    ? "PARTIAL"
                    : "WRONG_ANSWER";

                return (
                  <tr
                    key={submission.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setCurrentView("detail");
                    }}
                  >
                    <td className="px-4 py-3 text-xs">{submission.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(submission.submittedAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {submission.bahasa.nama}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusColor(verdict)}`}
                      >
                        {getStatusText(verdict)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium">
                      {submission.score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
