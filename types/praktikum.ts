interface Praktikum {
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
