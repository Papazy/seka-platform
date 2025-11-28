import { prisma } from "@/lib/prisma";
import { ListMahasiswaFromSoal } from "@/services/soal.service";

export const getCurrentSemester = async () => {
  try {
    const data = await prisma.pengaturanSistem.findFirst();
    return { semester: data?.currentSemester, tahun: data?.currentYear };
  } catch (error) {
    console.error("Error fetching current semester:", error);
    return { semester: null, tahun: null };
  }
};


export const checkIsAsistenPraktikum = async (mahasiswaId: string, praktikumId: string) => {
  try{
    if(!mahasiswaId || !praktikumId) {
      console.log("Missing mahasiswaId or praktikumId");
      return false;
    }

    const asistenPraktikum = await prisma.asistenPraktikum.findFirst({
      where: {
        idMahasiswa: mahasiswaId,
        idPraktikum: praktikumId,
      }
    })

    if(!asistenPraktikum){
      return false;
    }
    
    return true;
  }catch(error){
    console.error("Error checking asisten praktikum:", error);
    return false;
  }
}

export const checkIsAsistenPraktikumByUserId = async (userId: string, praktikumId: string) => {
  try{
    if(!userId || !praktikumId){
      console.log("Missing userId or praktikumId");
      return false;
    }

    const asistenPraktikum = await prisma.asistenPraktikum.findFirst({
      where: {
        mahasiswa: {
          id: userId,
        },
        praktikum: {
          id: praktikumId,
        }
      }
    })

    if(!asistenPraktikum) return false;

    return true;
  }catch(error){
    console.log("Error checking asisten praktikum by user id:", error);
    return false;
  }
}

export const checkIsAsistenPraktikumByUserIdAndSoaId = async (userId: string, soalId: string) => {
  try{
    if(!userId || !soalId){
      console.log("Missing userId or soalId");
      return false;
    }

    const asistenPraktikum = await prisma.asistenPraktikum.findFirst({
      where: {
        mahasiswa: {
          id: userId,
        },
        praktikum: {
          tugas: {
            some : {
              soal: {
                some: {
                  id: soalId,
                }
              }
            }
          }
        }
      }
    })

    if(!asistenPraktikum) return false;

    return true;

  }catch(error){
    console.log("Error checking asisten praktikum by user id and soal id:", error);
    return false;
  }
}

export const sortListMahasiswaSubmissions = (list: ListMahasiswaFromSoal[]): ListMahasiswaFromSoal[] => {
  return list.sort((a, b) => {
    const A = a.submissionsStats;
    const B = b.submissionsStats;

    // urutkan berdasarkan highestScore (100)
    if (A.highestScore > B.highestScore) return -1;
    else if (A.highestScore < B.highestScore) return 1;

    // jika sama, maka urutkan berdasarkan jumlah attempt paling sikit
    if (A.totalSubmission < B.totalSubmission) return -1;
    else if (A.totalSubmission > B.totalSubmission) return 1;

    // jika jumlah attempt sama, maka urutkan berdasarkan waktu latest attempt
    const timeA = A.latestSubmission?.createdAt.getTime();
    const timeB = B.latestSubmission?.createdAt.getTime();
    if(timeA && timeB){
      if ( timeA < timeB ) return -1;
      else if ( timeA > timeB) return 1;
    }

    return 0;
  })
}