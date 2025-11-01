import { useSemester } from "@/hooks/useAktifSemester";

interface CurrentYearAndSemester {
  semester: string;
  year: number;
}

export function useCurrentYearAndSemester(): CurrentYearAndSemester {
  const { activeSemester } = useSemester();

  const semester = activeSemester?.semester || "GANJIL";
  const year = activeSemester?.tahun || new Date().getFullYear();

  return {
    semester,
    year: year,
  };
}
