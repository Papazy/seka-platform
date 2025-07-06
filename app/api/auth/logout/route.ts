import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{
    const response = NextResponse.json({
      message: "Logout berhasil",
    });

    // Hapus cookie token
    response.cookies.delete('token')

    return response;
    
  }catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({error: "Terjadi kesalahan saat logout"}, {status: 500});
  }


}