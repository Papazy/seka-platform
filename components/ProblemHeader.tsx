"use client";

interface ProblemHeaderProps {
  problemData: {
    title: string;
    status: string;
    score: number | null;
    maxScore: number;
    examples: string[];
  };
  assignmentData: {
    className: string;
    title: string;
  };
  onBack: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function ProblemHeader({
  problemData,
  assignmentData,
  onBack,
  getStatusIcon,
  getStatusColor,
  getStatusText,
}: ProblemHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Problem Info */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(problemData.status)}
                <h1 className="text-2xl font-semibold text-gray-900">
                  {problemData.title}
                </h1>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(problemData.status)}`}
                >
                  {getStatusText(problemData.status)}
                </span>
              </div>
              <p className="text-gray-600">
                {assignmentData.className} • {assignmentData.title}
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="text-right">
            {problemData.status === "solved" && problemData.score !== null ? (
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {problemData.score}/{problemData.maxScore}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-semibold text-gray-400">
                  -{problemData.maxScore}
                </div>
                <div className="text-sm text-gray-600">Max Score</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
