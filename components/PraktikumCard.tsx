import { useCurrentYearAndSemester } from "@/lib/useCurrentYearAndSemester";

interface ClassItem {
  id: string;
  nama: string;
  kodePraktikum: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  ruang: string;
  role: "peserta" | "asisten";
  isActive: boolean;
}

export default function PraktikumCard({
  praktikum,
  onClick,
  isGridView,
}: {
  praktikum: ClassItem;
  onClick: (id: string) => void;
  isGridView: boolean;
}) {
  const { semester, year } = useCurrentYearAndSemester();

  const getBadgeColor = () => {
    return "bg-green-50 text-green-700 border-green-200";
  };

  const getRoleText = () => {
    return praktikum.role === "asisten" ? "Asisten" : "Peserta";
  };

  const getActiveStatus = () => {
    if (praktikum.semester === semester && praktikum.tahun === year) {
      return (
        <div className="flex items-center text-xs text-[#3ECF8E] font-medium">
          <div className="w-2 h-2 bg-[#3ECF8E] rounded-full mr-2"></div>
          Aktif
        </div>
      );
    }
    return (
      <div className="flex items-center text-xs text-gray-500 font-medium">
        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
        Tidak Aktif
      </div>
    );
  };

  const getRoleIcon = () => {
    if (praktikum.role === "asisten") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    );
  };

  if (isGridView) {
    return (
      <div
        onClick={() => onClick(praktikum.id)}
        className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#3ECF8E] transition-colors line-clamp-2 mb-2">
              {praktikum.nama}
            </h3>
            <p className="text-xs  text-gray-600 font-medium mb-1">
              Kelas {praktikum.kelas}
            </p>
            <p className="text-xs text-gray-500">
              {praktikum.semester} {praktikum.tahun}
            </p>
          </div>
        </div>

        {/* Detail Jadwal */}
        <div className="space-y-3 mb-2 flex gap-2 items-baseline">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{praktikum.jadwalHari}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">{praktikum.ruang}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 font-medium">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getBadgeColor()}`}
            >
              {getRoleIcon()}
              <span>{getRoleText()}</span>
            </span>
          </div>
          {getActiveStatus()}
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={() => onClick(praktikum.id)}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6 flex-1">
          {/* Main Info */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#3ECF8E] transition-colors line-clamp-2 mb-2">
              {praktikum.nama}
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Kelas {praktikum.kelas} • {praktikum.semester} {praktikum.tahun}
            </p>
          </div>

          {/* Schedule Info */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{praktikum.jadwalHari}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="font-medium">{praktikum.ruang}</span>
            </div>
          </div>

          {/* Status & Role */}
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getBadgeColor()}`}
            >
              {getRoleIcon()}
              <span>{getRoleText()}</span>
            </span>

            {getActiveStatus()}
          </div>
        </div>

        {/* Arrow */}
        <div className="ml-4">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-[#3ECF8E] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
