import React from 'react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface AssignmentListProps {
  assignments: Assignment[];
  isAssistant: boolean;
  onEdit: (assignmentId: string) => void;
  onDelete: (assignmentId: string) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, isAssistant, onEdit, onDelete }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Assignments</h2>
      <ul className="list-disc pl-5">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-gray-500">Due: {assignment.dueDate}</p>
              </div>
              {isAssistant && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(assignment.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(assignment.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;