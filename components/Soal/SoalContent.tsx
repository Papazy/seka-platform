import toast from "react-hot-toast";
import MarkdownRenderer from "../MarkdownRenderer";
import { Button } from "../ui/button";
import { Clipboard } from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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
                          <div className="text-sm flex items-center mb-1">
                            <InformationCircleIcon className="w-6 h-6 text-yellow-800 mr-2 inline-block" />
                            Note
                          </div>
                          <p className="text-xs text-yellow-800 ">
                            {tc.penjelasanInput}
                          </p>
                        </div>
                      )}
                    {tc.penjelasanOutput &&
                      tc.penjelasanOutput.trim() !== "-" && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                          <InformationCircleIcon className="w-6 h-6 text-yellow-800 mr-2 inline-block" />
                          <p className="text-xs text-yellow-800 ">
                            {tc.penjelasanOutput}
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

export default SoalContent;