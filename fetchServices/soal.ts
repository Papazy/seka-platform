import { ListMahasiswaFromSoal } from "@/services/soal.service";
import { ApiResponse, FormattedResponseProps } from "@/utils/response.utils";

export const fetchHasilSubmissionSoalMahasiswa = async (soalId: string): Promise<ApiResponse<ListMahasiswaFromSoal[]>> => {
    const url = `/api/soal/${soalId}/hasil-tugas-mahasiswa`;
    const res = await fetch(url, {
        credentials: "include",
    });
    const resData = await res.json();
    if (!res.ok) {
        throw new Error(resData.message || "Gagal mendapatkan hasil submission soal mahasiswa");
    }
    return resData;
}