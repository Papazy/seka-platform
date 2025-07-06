'use client';

interface PendingAssignment {
  id: number;
  title: string;
  className: string;
  classCode: string;
  timeLeft: string;
  submitted: number;
  total: number;
}

interface PendingAssignmentsProps {
  assignments: PendingAssignment[];
  onAssignmentClick: (id: number) => void;
}

export default function PendingAssignments({ assignments, onAssignmentClick }: PendingAssignmentsProps) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">No pending assignments</h3>
          {/* <p className="text-gray-600 text-sm">No pending assignments.</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Pending assignments</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {assignments.map((assignment) => (
          <div 
            key={assignment.id}
            onClick={() => onAssignmentClick(assignment.id)}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-[#3ECF8E] transition-colors mb-1">
                  {assignment.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {assignment.classCode} • {assignment.className}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {assignment.timeLeft}
                </div>
                <div className="text-xs text-gray-500">
                  remaining
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {assignment.submitted}/{assignment.total} submitted
              </span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#3ECF8E] h-2 rounded-full transition-all"
                  style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button className="text-sm text-[#3ECF8E] hover:text-[#3ECF8E]/80 font-medium transition-colors">
          View all assignments →
        </button>
      </div> */}
    </div>
  );
}