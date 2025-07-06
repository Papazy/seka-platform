import { loginWithCredentials } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try{

    const {email, password} = await req.json();
    
    if (!email || !password) {
    return NextResponse.json({error: "Email dan password wajib diisi"}, {status: 400});
  }
  
  const data = await loginWithCredentials(email, password);
  
  if (!data) {
    return NextResponse.json({error: "Email atau password salah"}, {status: 401});
  }
  
  // buat jwt token
  const token = data.token;

  if(!token){
    return NextResponse.json({error: "Gagal membuat token"}, {status: 500});
  }
  
  const response = NextResponse.json({
    message: "Login berhasil",
    user : {
      id: data.user.id,
      email: data.user.email,
      nama: data.user.nama,
      role: data.user.role,
    }
  });

  // set cookie
  response.cookies.set('token', token, {
    httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 // 7 hari
    })
    
    // kembalikan response
    return response;
  }catch(error){
    console.error("Error during login:", error);
    return NextResponse.json({error: "Terjadi kesalahan saat login"}, {status: 500});
  }
}