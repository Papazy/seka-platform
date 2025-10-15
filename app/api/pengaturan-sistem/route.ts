import { getActiveSemester, setActiveSemester } from "@/services/semester.service";
import { FormattedResponse } from "@/utils/response.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const serviceResponse = await getActiveSemester()
    return FormattedResponse(serviceResponse);
}


export async function POST(request: NextRequest){
    const {semester, tahun} = await request.json()
    if(!semester || !tahun) {
        return FormattedResponse({
            success: false,
            error: "Required semester and tahun field"
        })
    }

    const serviceResponse = await setActiveSemester({semester, tahun});
    return FormattedResponse(serviceResponse);
}
