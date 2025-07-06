'use client'

interface ClassItem {
  id: number;
  name: string;
  code: string;
  instructor: string;
  students: number;
  type: 'learning' | 'teaching';
  status?: 'active' | 'inactive';
  semester?: string;
  year?: number;
  description?: string;
  schedule?: string;
  room?: string;
  credits?: number;
  assignments?: number;
  completedAssignments?: number;
}

interface ClassCardProps {
  classItem: ClassItem;
  onClick: (id: number) => void;
  role: string
}

export default function ClassCard({ classItem, onClick, role = 'learning' }: ClassCardProps) {
  return (
    <div
      onClick={() => onClick(classItem.id)}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
    >
      <div className="mb-3">
        <div className="flex items-start justify-between">

        <h3 className="text-base font-semibold text-gray-900 hover:text-[#3ECF8E] transition-colors">
          {classItem.name}
          </h3>
          {/* {role === 'teaching' && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 bg-blue-50 text-blue-700 border-blue-200`}>
          <span>Teaching</span>
        </span>
          )} */}
          </div>
        <p className="text-sm text-gray-500">{classItem.code} • {classItem.instructor}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{classItem.students} mahasiswa</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
          {role === 'teaching' ? 'Pengajar' : 'Siswa'}
        </span>
      </div>
    </div>
  );
}