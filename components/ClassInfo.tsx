import React from 'react';

interface ClassInfoProps {
  className: string;
  instructor: string;
  schedule: string;
}

const ClassInfo: React.FC<ClassInfoProps> = ({ className, instructor, schedule }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-2">{className}</h2>
      <p className="text-gray-700"><strong>Instructor:</strong> {instructor}</p>
      <p className="text-gray-700"><strong>Schedule:</strong> {schedule}</p>
    </div>
  );
};

export default ClassInfo;