export interface Submission {
  id: string
  idSoal: string
  idPeserta: string
  idBahasa: string
  sourceCode: string
  score: number
  statusJawaban: string
  status: string
  statusCode: string
  submittedAt: string
  createdAt: string
  updatedAt: string
  bahasa: Bahasa
  testCaseResult: any[]
  soal?: Soal
  peserta?: Peserta
  waktuRataRataEksekusiMs: number;
  memoriRataRataKb: number;  
}

export interface Bahasa {
  id: string
  nama: string
  ekstensi: string
  compiler: string
  versi: string
  createdAt: string
  updatedAt: string
}

export interface Soal {
  id: string
  idTugas: string
  judul: string
  deskripsi: string
  batasan: string
  formatInput: string
  formatOutput: string
  batasanMemoriKb: number
  batasanWaktuEksekusiMs: number
  templateKode: string
  bobotNilai: number
  createdAt: string
  updatedAt: string
}

export interface Peserta {
  id: string
  idMahasiswa: string
  idPraktikum: string
  createdAt: string
  mahasiswa: Mahasiswa
}

export interface Mahasiswa {
  id: string
  npm: string
  nama: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
  programStudiId: string
}
