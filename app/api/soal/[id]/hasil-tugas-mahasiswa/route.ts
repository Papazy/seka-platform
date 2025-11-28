import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getListMahasiswaFromSoal } from "@/services/soal.service";
import { checkIsAsistenPraktikumByUserIdAndSoaId } from "@/app/api/utils";

export async function GET(req: NextRequest, {params} : {params: Promise<{id: string}>}){
    try{
        const token = req.cookies.get("token")?.value;

        const {id: soalId} = await params;

        if(!token){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const payload = await verifyToken(token);

        console.log("payload", payload);
        console.log("soalId", soalId);
        const isAsistenThisSoalPraktikum = await checkIsAsistenPraktikumByUserIdAndSoaId(payload.id, soalId);

        if(!isAsistenThisSoalPraktikum){
            return NextResponse.json({error: "Forbidden", message: "Anda tidak memiliki akses untuk melihat hasil list mahasiswa soal ini"}, {status: 403});
        }

        const serviceResponse = await getListMahasiswaFromSoal(soalId);

        if(!serviceResponse || !serviceResponse.success) {
            return NextResponse.json({
                error: "Internal Server Error",
                message: serviceResponse?.message || "Gagal mendapatkan data"
            })
        }

        return NextResponse.json(serviceResponse)
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error"
        }, {status: 500})
    }
}