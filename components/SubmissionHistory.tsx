import React from "react";

const SubmissionHistory = () => {
  // Mock data for submission history
  const submissions = [
    {
      id: 1,
      assignment: "Algoritma dan Struktur Data - Tugas 1",
      submittedAt: "2023-10-01",
      status: "Correct",
    },
    {
      id: 2,
      assignment: "Pemrograman Web - Tugas 2",
      submittedAt: "2023-10-05",
      status: "Incorrect",
    },
    {
      id: 3,
      assignment: "Database Management - Tugas 1",
      submittedAt: "2023-10-10",
      status: "Correct",
    },
    {
      id: 4,
      assignment: "Machine Learning - Tugas 1",
      submittedAt: "2023-10-15",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-4">Submission History</h2>
      <p className="text-gray-600 mb-6">Here are your submitted assignments:</p>

      <div className="bg-white shadow rounded-lg p-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Assignment</th>
              <th className="py-2 px-4 text-left">Submitted At</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id} className="border-b">
                <td className="py-2 px-4">{submission.assignment}</td>
                <td className="py-2 px-4">{submission.submittedAt}</td>
                <td
                  className={`py-2 px-4 ${submission.status === "Correct" ? "text-green-600" : submission.status === "Incorrect" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {submission.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionHistory;
