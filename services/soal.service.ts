import { prisma } from "@/lib/prisma"
import { getSubmissionStatsFromSubmissions, ServiceResponse, ServiceResponseType, SubmissionsStats } from "./utils"
import { HasilTugasMahasiswa, Prisma, Submission } from "@prisma/client"
import { sortListMahasiswaSubmissions } from "@/app/api/utils"

type PesertaPraktikumType = Prisma.PesertaPraktikumGetPayload<{
    include: {
        mahasiswa: {
            select: {
                id: true,
                npm: true,
                nama: true,
                email: true,
            }
        },
        submission: {
            include: {
                bahasa: true,
                testCaseResult: true,
                peserta: true,
                soal: true,
            }
        },
    }
}>

export type ListMahasiswaFromSoal = Omit<PesertaPraktikumType, "submission"> & { // gabung hasil omit dengan submissions
    submissions: PesertaPraktikumType["submission"];
    submissionsStats: SubmissionsStats
}

export const getListMahasiswaFromSoal = async (soalId: string): Promise<ServiceResponseType<ListMahasiswaFromSoal[]>> => {
    const soalData = await prisma.soal.findFirst({
        where: { id: soalId },
        include: {
            tugas: {
                include: {
                    praktikum: true,
                }
            }
        }
    })

    if (!soalData) {
        return ServiceResponse({
            success: false,
            error: "NOT_FOUND",
            message: "Maaf soal tidak ditemukan"
        });
    }

    const listMahasiswa = await prisma.pesertaPraktikum.findMany({
        where: { idPraktikum: soalData.tugas.praktikum.id },
        include: {
            mahasiswa: {
                select: {
                    id: true,
                    npm: true,
                    nama: true,
                    email: true
                },
            },
            submission: {
                where: {
                    idSoal: soalId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    bahasa: true,
                    testCaseResult: true,
                    peserta: {
                        include: {
                            mahasiswa: true
                        }
                    },
                    soal: true,
                }
            }
        }
    })
    
    const formattedListMahasiswa = listMahasiswa.map((mhs) => {
        const {submission, ...rest} = mhs; // buang submission karena mau pkai submissions
        const submissionsStats = getSubmissionStatsFromSubmissions(submission)

        return {
            ...rest,
            submissions: submission,
            submissionsStats: submissionsStats || {}
        }
    })

    const sortedList = sortListMahasiswaSubmissions(formattedListMahasiswa);

    return ServiceResponse({
        success: true,
        data: sortedList,
    })
}

