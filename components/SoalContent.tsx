import { TugasDetailResponse } from "@/hooks/useTugasDetail";
import { useParams, useRouter } from "next/navigation";

import { Button } from "./ui/button";
import SoalCard from "./SoalCard";

const SoalContent = ({ tugas, role }: { tugas: TugasDetailResponse, role: 'ASISTEN' | 'PESERTA' }) => {
  const router = useRouter();
  const params = useParams();

  const praktikumId = params.id as string;

  const handleSoalClick = (soalId: string) => {
    router.push(`/mahasiswa/praktikum/${praktikumId}/tugas/${tugas.id}/soal/${soalId}`);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg border p-4 flex justify-between items-center">
        <div className="">
          <h2 className="text-lg font-semibold">Daftar Soal</h2>
          <p className="text-sm text-gray-600 mt-1">
            {tugas.soal.length} soal tersedia
          </p>
        </div>

        {role.toLocaleLowerCase() === 'asisten' && (

          <Button 
          variant='default'
        onClick={()=> router.push(`/mahasiswa/praktikum/${praktikumId}/tugas/${tugas.id}/soal/create`)}
        className='text-white bg-green-primary hover:bg-green-600 cursor-pointer rounded shadow-sm '
        >+ Soal</Button>
        )}
      </div>

      {/* Soal List */}
      {tugas.soal.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <p className="text-gray-500">Belum ada soal untuk tugas ini.</p>
        </div>
      ) : (
        tugas.soal.map((soal, index) => (
          <SoalCard
            key={soal.id}
            soal={soal}
            index={index + 1}
            userRole={tugas.userRole}
            praktikumId={praktikumId}
            tugasId={tugas.id}
            soalId={soal.id}
          />
        ))
      )}
    </div>
  );
};

export default SoalContent;