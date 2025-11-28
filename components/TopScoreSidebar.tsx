import { useTopScoreSoal } from "@/hooks/useTopScoreSoal";
import { useParams } from "next/navigation";

const TopScoreSidebar = ({ soalId }: { soalId: string }) => {
  const params = useParams();

  const { data: topScores, isLoading, error } = useTopScoreSoal(soalId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Top Scores</h2>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">Top Scores</h2>
      </div>
      <div className="p-4">
        {!topScores || topScores.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Belum ada submission
          </div>
        ) : (
          <div className="space-y-3">
            {topScores.map((student: any, index: number) => (
              <div
                key={student.npm}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === 0
                        ? "bg-gray-100 text-gray-800"
                        : index === 1
                          ? "bg-gray-100 text-gray-800"
                          : index === 2
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.nama}
                    </div>
                    <div className="text-xs text-gray-500">{student.npm}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {student.score}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(() => {
                      const submittedDate = new Date(student.submittedAt);
                      const now = new Date();
                      const diffMs = now.getTime() - submittedDate.getTime();
                      const diffMinutes = Math.floor(diffMs / (1000 * 60));
                      const diffHours = Math.floor(diffMinutes / 60);
                      const diffDays = Math.floor(diffHours / 24);

                      if (diffDays > 0) return `${diffDays} hari lalu`;
                      if (diffHours > 0) return `${diffHours} jam lalu`;
                      if (diffMinutes > 0) return `${diffMinutes} menit lalu`;
                      return "Baru saja";
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopScoreSidebar;
