import { RolePraktikum, TestResultResponse } from "@/app/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/page";
import TopScoreSidebar from "@/components/TopScoreSidebar";
import { Bahasa } from "@/hooks/useBahasa";
import { PraktikumRole } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const RightSidebar = ({
  bahasa,
  soal,
  activeTab,
  setActiveTab,
  refetchSubmission,
  role,
}: {
  bahasa: Bahasa[];
  soal?: any;
  activeTab: "soal" | "submission";
  setActiveTab: (tab: "submission" | "soal") => void;
  refetchSubmission: () => void;
  role: RolePraktikum;
}) => {
  return activeTab === "soal" ? (
    <SubmitJawabanSidebar
      bahasa={bahasa}
      soal={soal}
      setActiveTab={setActiveTab}
      refetchSubmission={refetchSubmission}
      role={role}
    />
  ) : (
    <TopScoreSidebar soalId={soal?.id as string} />
  );
};

const SubmitJawabanSidebar = ({
  bahasa,
  soal,
  setActiveTab,
  refetchSubmission,
  role,
}: {
  bahasa: Bahasa[];
  soal?: any;
  setActiveTab: (tab: "submission" | "soal") => void;
  refetchSubmission: () => void;
  role: RolePraktikum;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<TestResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collapse states
  const [isTemplateExpanded, setIsTemplateExpanded] = useState(false);
  const [isSubmitExpanded, setIsSubmitExpanded] = useState(true);
  const [isResultExpanded, setIsResultExpanded] = useState(true);

  const router = useRouter();

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
      console.log("testResult", result);
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
        throw new Error(errorData.message || "Submit failed");
      }

      // Handle successful submission
      refetchSubmission();
      const result = await response.json();
      toast.success(`Submit berhasil!`);

      // Reset form
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setActiveTab("submission");
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "submission");
      router.replace(url.pathname + url.search, { scroll: false });
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
                {isLoading
                  ? "Running..."
                  : role === PraktikumRole.ASISTEN
                    ? "Tes Testcases"
                    : "Tes Kode"}
              </button>
              {role === PraktikumRole.PRAKTIKAN && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !uploadedFile}
                  className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Submit Jawaban
                </button>
              )}
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
              {testResult.data && (


                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${testResult.data.verdict === "AC"
                        ? "bg-green-100 text-gray-800"
                        : testResult.data.verdict === "CE"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {testResult.data.verdict === "AC" ||
                        testResult.data.verdict === "WA"
                        ? "Selesai"
                        : testResult.data.verdict === "CE"
                          ? "Compile Error"
                          : "Runtime Error"}
                    </span>
                  </div>
                  {(testResult.data.verdict === "AC" ||
                    testResult.data.verdict === "WA") && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-700">Test Case:</div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">
                            {testResult.data.passed_cases}/
                            {testResult.data.total_cases}
                          </span>{" "}
                          berhasil
                        </div>
                      </div>
                    )}
                </div>
              )}
              {/* Error Message */}
              {testResult.message && !testResult.success &&
                (
                  // handled error
                  testResult.error === "TESTCASE_NOT_FOUND" ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
                        Maaf, contoh test case tidak tersedia untuk soal ini.
                      </pre>
                    </div>
                  ) : (

                    //nonhandled error
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-red-800 mb-2">
                        Error:
                      </h4>
                      <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border overflow-x-auto">
                        {testResult.message}
                      </pre>
                    </div>
                  )
                )
              }

              {/* Test Cases Results */}
              {testResult.data?.test_results &&
                testResult.data?.test_results.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-800">
                      Detail Test Cases:
                    </h4>
                    {testResult.data.test_results.map((result, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 ${result.verdict === "AC"
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
                              className={`px-2 py-1 rounded text-xs font-medium ${result.verdict === "AC"
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
                              Output diharapkan:
                            </span>
                            <pre className="bg-white p-2 rounded border border-green-100 mt-1 overflow-x-auto">
                              {result.expected_output}
                            </pre>
                          </div>
                          <div>
                            <span className="font-medium text-green-700">
                              Output kode:
                            </span>
                            <pre
                              className={`p-2 rounded border mt-1 overflow-x-auto ${result.verdict === "AC"
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

export default RightSidebar;