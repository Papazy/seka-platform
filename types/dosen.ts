import { User } from "./user";

export interface Dosen extends User {
  nip: string;
  jabatan: string;
  programStudiId: string;
}
