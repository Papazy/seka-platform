import { useAuth } from "@/contexts/AuthContext";
import { useRolePraktikum } from "@/contexts/RolePraktikumContext";
import getRelativeDeadline from "@/utils/getRelativeTime";
import { getStatusTugasCardForPraktikan } from "@/utils/getStatusTugasCardForPraktikan";
import Link from "next/link";

const TugasCard = ({
  tugas,
  praktikumId,
}: {
  tugas: any;
  praktikumId: string;
}) => {
  let deadlineText = getRelativeDeadline(tugas.deadline);
  const deadlineTime = new Date(tugas.deadline).getTime();
  const now = Date.now();
  
  const { checkRole } = useRolePraktikum();
  const userRole = checkRole(praktikumId);
  let status = "";
  let statusStyle = "";
  console.log("Tugas status:", tugas);
  console.log("deadlineTime:", deadlineTime);
  console.log("now:", now);

  if(userRole === "PESERTA"){
    const {status: newStatus, statusStyle: newStatusStyle} = getStatusTugasCardForPraktikan(tugas);
    status = newStatus;
    statusStyle = newStatusStyle;
  }

  if (deadlineText.includes("lewat")) {
    if(userRole === "ASISTEN") {
      deadlineText = "Selesai"
    }else{
      deadlineText = "";
    }
  }
  
  return (
    <Link
      href={`/mahasiswa/praktikum/${praktikumId}/tugas/${tugas.id}`}
      prefetch //   Prefetch otomatis
      className="border rounded p-4 cursor-pointer hover:border-gray-400 flex justify-between"
    >
      <div className="w-full">
        <div className="flex justify-between items-start mb-2 w-full ">
          <h3 className="font-medium">{tugas.judul}</h3>
          <div className="flex items-center gap-3">
            {tugas.status && (
              <span
                className={`text-xs px-2 py-1 rounded ${statusStyle}`}
              >
                {status}
              </span>
            )}
              <div className="text-red-500 text-sm">{deadlineText}</div>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-gray-500">
          <span>
            Deadline: {new Date(tugas.deadline).toLocaleDateString("id-ID")}
          </span>
          <span>{tugas.totalSoal} soal</span>
          <span>Max {tugas.maksimalSubmit} submit</span>
        </div>
      </div>
      


    </Link>
  );
};

export default TugasCard;
