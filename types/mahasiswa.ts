import { ProgramStudi } from "./porgramStudi";
import { User } from "./user";

export interface Mahasiswa extends User{
  npm: string;
  programStudiId: string;
  programStudi: ProgramStudi
}

