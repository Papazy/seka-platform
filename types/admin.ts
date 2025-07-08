export interface Fakultas {
  id: number;
  nama: string;
  kodeFakultas: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramStudi {
  id: number;
  nama: string;
  kodeProdi: string;
  idFakultas: number;
  createdAt: Date;
  updatedAt: Date;
}

