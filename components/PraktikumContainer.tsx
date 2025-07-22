import PraktikumCard from "./PraktikumCard";

interface ClassItem {
  id: number;
  nama: string;
  kodePraktikum: string;
  kelas: string;
  semester: string;
  tahun: number;
  jadwalHari: string;
  ruang: string;
  role: 'peserta' | 'asisten';
  isActive: boolean;
}

type ViewMode = 'grid' | 'list';

export default function PraktikumContainer({ 
  praktikumList, 
  viewMode, 
  onClick 
}: { 
  praktikumList: ClassItem[]; 
  viewMode: ViewMode;
  onClick: (id: number) => void;
}) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {praktikumList.map((praktikum) => (
      
          <PraktikumCard
            key={praktikum.id}
            praktikum={praktikum}
            onClick={onClick}
            isGridView={true}
            />

        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {praktikumList.map((praktikum) => (

        <PraktikumCard
          key={praktikum.id}
          praktikum={praktikum}
          onClick={onClick}
          isGridView={false}
          />
   
      ))}
    </div>
  );
}