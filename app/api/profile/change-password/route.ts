import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/lib/enum";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try{

    const token = req.cookies.get('token')?.value;
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({error: "Token tidak valid"}, {status: 401});
    }

    const { oldPassword, confirmPassword, newPassword } = await req.json();

    if (!oldPassword || !confirmPassword || !newPassword) {
      return NextResponse.json({error: "Semua field harus diisi"}, {status: 400});
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({error: "Konfirmasi password tidak sesuai"}, {status: 400});
    }

    if(oldPassword === newPassword) {
      return NextResponse.json({error: "Password baru tidak boleh sama dengan password lama"}, {status: 400});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let updatedUser = null;
    switch(payload.role) {
      case UserRole.ADMIN:
        updatedUser = await prisma.admin.findUnique({
          where: { id: payload.id }
        });
        break;
      case UserRole.LABORAN:
        updatedUser = await prisma.laboran.findUnique({
          where: { id: payload.id }
        });
        break;
      case UserRole.DOSEN:
        updatedUser = await prisma.dosen.findUnique({
          where: { id: payload.id }
        });
        break;
      case UserRole.MAHASISWA:
        updatedUser = await prisma.mahasiswa.findUnique({
          where: { id: payload.id }
        })
        break;
      default:
        return NextResponse.json({error: "Role tidak dikenali"}, {status: 400});
    }
    if (!updatedUser) {
      return NextResponse.json({error: "User tidak ditemukan"}, {status: 500});
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, updatedUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({error: "Password lama tidak valid"}, {status: 400});
    }

    // Update password
    switch(payload.role) {
      case UserRole.ADMIN:
        updatedUser = await prisma.admin.update({
          where: { id: payload.id },
          data: {
            password: hashedPassword
          }
        });
        break;
      case UserRole.LABORAN:
        updatedUser = await prisma.laboran.update({
          where: { id: payload.id },
          data: {
            password: hashedPassword
          }
        });
        break;
      case UserRole.DOSEN:
        updatedUser = await prisma.dosen.update({
          where: { id: payload.id },
          data: {
            password: hashedPassword
          }
        });
        break;
      case UserRole.MAHASISWA:
        updatedUser = await prisma.mahasiswa.update({
          where: { id: payload.id },
          data: {
            password: hashedPassword
          }
        })
        break;
    }


    return NextResponse.json({
      message: "Password berhasil diperbarui",
      user: {
        id: updatedUser.id,
        nama: updatedUser.nama,
        email: updatedUser.email,
        role: payload.role
      }
    }, {status: 200});



    
  }catch (error) {
    console.error('Error in PUT request:', error);
    return NextResponse.json({error: "Terjadi kesalahan server"}, {status: 500});
  }

}