export interface Submission {
  id: string;
  score: number;
  submittedAt: string;
  sourceCode: string;
  bahasa: {
    nama: string;
    ekstensi: string;
  };
  testCaseResult: Array<{
    status: string;
    waktuEksekusiMs: number;
    memoriKb: number;
  }>;
}