interface CurrentYearAndSemester {
  semester: string;
  year: number;
}

export function getCurrentYearAndSemester(): CurrentYearAndSemester {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Semester Genap: Januari - Juni (0-5), Semester Ganjil: Juli - Desember (6-11)
  const semester = month < 8 ? "GENAP" : "GANJIL";

  return {
    semester,
    year: year,
  };
}
