"use client";

interface BreadcrumbProps {
  classId: string;
  assignmentId: string;
  assignmentData: {
    className: string;
    title: string;
  };
  problemTitle: string;
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({
  classId,
  assignmentId,
  assignmentData,
  problemTitle,
  onNavigate,
}: BreadcrumbProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button
              onClick={() => onNavigate("/")}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Classes
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                onClick={() => onNavigate(`/class/${classId}`)}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                {assignmentData.className}
              </button>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                onClick={() =>
                  onNavigate(`/class/${classId}/assignment/${assignmentId}`)
                }
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                {assignmentData.title}
              </button>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 text-sm font-medium">
                {problemTitle}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}
