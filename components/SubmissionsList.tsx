// app/components/SubmissionsList.tsx
"use client";

import { useState } from "react";

interface Submission {
  id: string;
  status: string;
  score: number;
  language: string;
  submittedAt: string;
  executionTime: string;
  memory: string;
  testsPassed: number;
  totalTests: number;
  code?: string;
}

interface SubmissionsListProps {
  submissions: Submission[];
  maxScore: number;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export default function SubmissionsList({
  submissions,
  maxScore,
  getStatusColor,
  formatDate,
}: SubmissionsListProps) {
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(
    null,
  );

  const toggleSubmission = (submissionId: string) => {
    setExpandedSubmission(
      expandedSubmission === submissionId ? null : submissionId,
    );
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return "Accepted";
      case "WRONG_ANSWER":
        return "Wrong Answer";
      case "COMPILATION_ERROR":
        return "Compilation Error";
      case "RUNTIME_ERROR":
        return "Runtime Error";
      case "TIME_LIMIT_EXCEEDED":
        return "Time Limit Exceeded";
      case "MEMORY_LIMIT_EXCEEDED":
        return "Memory Limit Exceeded";
      case "PENDING":
        return "Pending";
      case "JUDGING":
        return "Judging";
      case "JUDGE_ERROR":
        return "Judge Error";
      case "PARTIAL":
        return "Partial";
      default:
        return status;
    }
  };

  // ✅ Fix status colors for consistent display
  const getSubmissionStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return "bg-green-50 text-green-700 border-green-200";
      case "WRONG_ANSWER":
        return "bg-red-50 text-red-700 border-red-200";
      case "PARTIAL":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "COMPILATION_ERROR":
        return "bg-red-50 text-red-700 border-red-200";
      case "RUNTIME_ERROR":
        return "bg-red-50 text-red-700 border-red-200";
      case "TIME_LIMIT_EXCEEDED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "MEMORY_LIMIT_EXCEEDED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "PENDING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "JUDGING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "JUDGE_ERROR":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getStatusDescription = (submission: Submission) => {
    switch (submission.status.toUpperCase()) {
      case "RUNTIME_ERROR":
        return "Your code crashed during execution or produced no output";
      case "TIME_LIMIT_EXCEEDED":
        return "Your code took too long to execute (>2s per test case)";
      case "COMPILATION_ERROR":
        return "Your code failed to compile";
      case "WRONG_ANSWER":
        return `${submission.testsPassed}/${submission.totalTests} test cases passed`;
      case "PARTIAL":
        return `${submission.testsPassed}/${submission.totalTests} test cases passed`;
      case "ACCEPTED":
        return "All test cases passed!";
      case "PENDING":
        return "Waiting to be judged...";
      case "JUDGING":
        return "Currently being judged...";
      default:
        return "";
    }
  };

  if (submissions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Submissions
        </h3>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-600">
            Submit your solution to see results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Your Submissions ({submissions.length})
      </h3>
      <div className="space-y-4">
        {submissions.map(submission => (
          <div
            key={submission.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Main submission card */}
            <div
              className="p-4 hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => toggleSubmission(submission.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getSubmissionStatusColor(submission.status)}`}
                  >
                    {getStatusText(submission.status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {submission.language}
                  </span>
                  {expandedSubmission !== submission.id && (
                    <span className="text-xs text-gray-500">
                      Click to show code
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {submission.score}/{maxScore}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  {getStatusDescription(submission)}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Time:</span>
                  <div className="font-medium text-gray-900">
                    {submission.executionTime || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Memory:</span>
                  <div className="font-medium text-gray-900">
                    {submission.memory || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Tests:</span>
                  <div className="font-medium text-gray-900">
                    {submission.testsPassed || 0}/{submission.totalTests || 0}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Submitted:</span>
                  <div className="font-medium text-gray-900">
                    {formatDate(submission.submittedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable code section */}
            {expandedSubmission === submission.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Submitted Code
                    </h4>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        copyToClipboard(
                          submission.code || "// Code not available",
                        );
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Code display */}
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre">
                      <code>{submission.code || "// Code not available"}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
