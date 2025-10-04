export interface Fakultas {
  id: string;
  nama: string;
  kodeFakultas: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  idFakultas: number;
  createdAt: Date;
  updatedAt: Date;
}
