import React from "react";

const AssistantPanel = () => {
  const handleAddAssignment = () => {
    // Logic to add a new assignment
  };

  const handleEditAssignment = (assignmentId: string) => {
    // Logic to edit an existing assignment
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    // Logic to delete an assignment
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assistant Panel</h2>
      <button
        onClick={handleAddAssignment}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Assignment
      </button>
      {/* Example of rendering assignments with edit and delete options */}
      <div>
        {/* This should be replaced with actual assignment data */}
        {[
          { id: "1", title: "Assignment 1" },
          { id: "2", title: "Assignment 2" },
        ].map(assignment => (
          <div
            key={assignment.id}
            className="flex justify-between items-center mb-2"
          >
            <span>{assignment.title}</span>
            <div>
              <button
                onClick={() => handleEditAssignment(assignment.id)}
                className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAssignment(assignment.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantPanel;
