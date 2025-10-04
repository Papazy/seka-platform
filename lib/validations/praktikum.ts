import { error } from "console";

export interface PraktikumFormData {
  nama: string;
  kodePraktikum: string;
  kodeMk: string;
  kelas: string;
  semester: "GANJIL" | "GENAP";
  tahun: number;
  jadwalHari: string;
  jadwalJamMasuk: string;
  jadwalJamSelesai: string;
  ruang: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationOptions {
  isEdit?: boolean;
  originalKodePraktikum?: string;
  checkDuplicateKode?: boolean;
}

export function validatePraktikumForm(formData: PraktikumFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Required fields validation
  if (!formData.nama.trim()) {
    errors.nama = "Nama praktikum wajib diisi";
  }

  // Kode praktikum validation
  if (!formData.kodePraktikum.trim()) {
    errors.kodePraktikum = "Kode praktikum wajib diisi";
  } else if (
    formData.kodePraktikum.length < 3 ||
    formData.kodePraktikum.length > 20
  ) {
    errors.kodePraktikum =
      "Kode praktikum harus 3-20 karakter huruf besar dan angka";
  }

  // Kode mata kuliah validation
  if (!formData.kodeMk.trim()) {
    errors.kodeMk = "Kode mata kuliah wajib diisi";
  } else if (formData.kodeMk.length < 3 || formData.kodeMk.length > 20) {
    errors.kodeMk =
      "Kode mata kuliah harus 3-20 karakter huruf besar dan angka";
  }

  // Kelas validation
  if (!formData.kelas.trim()) {
    errors.kelas = "Kelas wajib diisi";
  }

  // Jadwal validation
  if (!formData.jadwalHari) {
    errors.jadwalHari = "Hari jadwal wajib dipilih";
  }

  if (!formData.jadwalJamMasuk) {
    errors.jadwalJamMasuk = "Jam masuk wajib diisi";
  }

  if (!formData.jadwalJamSelesai) {
    errors.jadwalJamSelesai = "Jam selesai wajib diisi";
  }

  // Ruang validation
  if (!formData.ruang.trim()) {
    errors.ruang = "Ruang wajib diisi";
  }

  // Tahun validation
  if (formData.tahun < 2020 || formData.tahun > 2030) {
    errors.tahun = "Tahun harus antara 2020-2030";
  }

  // Semester validation (optional since it's enum)
  if (!["GANJIL", "GENAP"].includes(formData.semester)) {
    errors.semester = "Semester harus GANJIL atau GENAP";
  }

  // Time logic validation
  if (formData.jadwalJamMasuk && formData.jadwalJamSelesai) {
    const jamMasuk = new Date(`2000-01-01T${formData.jadwalJamMasuk}:00`);
    const jamSelesai = new Date(`2000-01-01T${formData.jadwalJamSelesai}:00`);

    if (jamSelesai <= jamMasuk) {
      errors.jadwalJamSelesai = "Jam selesai harus lebih besar dari jam masuk";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
