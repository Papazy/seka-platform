import Link from "next/link";

const TugasCard = ({
  tugas,
  praktikumId,
}: {
  tugas: any;
  praktikumId: string;
}) => {
  return (
    <Link
      href={`/mahasiswa/praktikum/${praktikumId}/tugas/${tugas.id}`}
      prefetch //   Prefetch otomatis
      className="border rounded p-4 cursor-pointer hover:border-gray-400 block"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{tugas.judul}</h3>
        <div className="flex items-center gap-3">
          {tugas.status && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                tugas.status === "submitted"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              {tugas.status === "submitted" ? "Selesai" : "Belum"}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <span>
          Deadline: {new Date(tugas.deadline).toLocaleDateString("id-ID")}
        </span>
        <span>{tugas.totalSoal} soal</span>
        <span>Max {tugas.maksimalSubmit} submit</span>
      </div>
    </Link>
  );
};

export default TugasCard;
