export interface Submission {
  id: string;
  idSoal: string;
  idPeserta: string;
  idBahasa: string;
  sourceCode: string;
  score: number;
  statusJawaban: string;
  status: string;
  statusCode: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  bahasa: Bahasa;
  testCaseResult: any[];
}

export interface Bahasa {
  id: string;
  nama: string;
  ekstensi: string;
  compiler: string;
  versi: string;
  createdAt: string;
  updatedAt: string;
}
