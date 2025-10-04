interface Praktikum {
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
