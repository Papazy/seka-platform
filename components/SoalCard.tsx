import { TugasDetailResponse } from "@/hooks/useTugasDetail";
import Link from "next/link";

const SoalCard = ({
  soal,
  index,
  userRole,
  praktikumId,
  tugasId,
  soalId,
}: {
  soal: TugasDetailResponse["soal"][0];
  index: number;
  userRole: "peserta" | "asisten";
  praktikumId: string;
  tugasId: string;
  soalId: string;
}) => {
  const getStatusBadge = () => {
    if (userRole === "asisten") {
      return (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          {soal.totalSubmissions || 0} submission
        </span>
      );
    }

    if (soal.bestScore !== undefined && soal.bestScore >= soal.bobotNilai) {
      return (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Selesai
        </span>
      );
    }

    if (soal.submissionCount && soal.submissionCount > 0) {
      return (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Dicoba ({soal.submissionCount}x)
        </span>
      );
    }

    return (
      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
        Belum dicoba
      </span>
    );
  };

  return (
    <Link
      href={`/mahasiswa/praktikum/${praktikumId}/tugas/${tugasId}/soal/${soalId}`}
    >
      <div className="bg-white rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                Soal {index}
              </span>
              {getStatusBadge()}
            </div>

            <h3 className="font-medium text-gray-900 mb-2">{soal.judul}</h3>

            <div className="flex gap-6 text-sm text-gray-600">
              <span>{soal.bobotNilai} poin</span>
              <span>{soal.batasanWaktuEksekusiMs}ms</span>
              <span>{Math.round(soal.batasanMemoriKb / 1024)}MB</span>
              <span>{soal.totalTestCase} test case</span>
            </div>
          </div>

          <div className="text-right ml-4">
            {userRole === "peserta" && soal.bestScore !== undefined && (
              <div className="mb-2">
                <div className="text-lg font-bold text-green-600">
                  {soal.bestScore}
                </div>
                <div className="text-xs text-gray-500">Best Score</div>
              </div>
            )}

            <div className="text-sm text-green-600">
              {userRole === "peserta" && soal.canSubmit ? "Kerjakan" : "Lihat"}{" "}
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SoalCard;
