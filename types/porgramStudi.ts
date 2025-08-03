import { Fakultas } from "./admin";

export interface ProgramStudi {
  id: string;
  nama: string;
  kodeProdi: string;
  idFakultas: string;
  fakultas: Fakultas;

  createdAt: string;
  updatedAt: string;
}