import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest){
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/laboran',
    '/dosen',
    '/mahasiswa',
    '/asisten',
    '/praktikum',
  ]

  const isProtected = protectedRoutes.some(route=> pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if(!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = await verifyToken(token);

    return NextResponse.next()
  }catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

}

export const config = {
  matcher: ['/((?!api/auth|_next|favicon.ico|public|login).*)'], 
}