import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/lib/enum";
import { prisma } from "@/lib/prisma";
import bcyrpt  from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const LABORAN_PASSWORD_DEFAULT = 'laboran123';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const laboran = await prisma.laboran.findMany();

    return NextResponse.json({
      message: "Data laboran berhasil diambil",
      laboran: laboran.map(l => ({
        id: l.id,
        nama: l.nama,
        email: l.email,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }))
    })


  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try{
    const token = req.cookies.get('token')?.value;

    if(!token){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    // UNCOMMENT nanti (hanya admin yang bisa akses)
    if(payload.role !== UserRole.ADMIN){
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {nama, email, password} = await req.json();
    if(!nama || !email){
      return NextResponse.json({ error: 'Nama dan email harus diisi' }, { status: 400 });
    }

    const existingLaboran = await prisma.laboran.findUnique({
      where: { email }
    });

    if (existingLaboran) {
      return NextResponse.json({ error: 'Laboran dengan email ini sudah ada' }, { status: 400 });
    }

    const hashedPassword = await bcyrpt.hash(password ?? LABORAN_PASSWORD_DEFAULT, 10);

    const newLaboran = await prisma.laboran.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        idAdmin: payload.id,
      }
    })


    return NextResponse.json({
      message: "Laboran berhasil dibuat",
      laboran: {
        id: newLaboran.id,
        nama: newLaboran.nama,
        email: newLaboran.email,
        createdAt: newLaboran.createdAt,
        updatedAt: newLaboran.updatedAt
      }
    }, {status: 201})


  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try{
    const token = req.cookies.get('token')?.value

    if(!token){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if(payload.role !== UserRole.ADMIN){
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {id, nama, email} = await req.json();

    if(!id || !nama || !email){
      return NextResponse.json({ error: 'Id, nama dan email harus diisi' }, { status: 400 });
    }

    const existingLaboran = await prisma.laboran.findUnique({
      where: { id: id }
    });

    if (!existingLaboran) {
      return NextResponse.json({ error: 'Laboran tidak ditemukan' }, { status: 404 });
    }

    const updatedLaboran = await prisma.laboran.update({
      where: { id: existingLaboran.id },
      data: {
        nama,
        email,
      }
    });


    return NextResponse.json({
      message: "Laboran berhasil diperbarui",
      laboran: {
        id: updatedLaboran.id,
        nama: updatedLaboran.nama,
        email: updatedLaboran.email,
        createdAt: updatedLaboran.createdAt,
        updatedAt: updatedLaboran.updatedAt
      }
    }, {status: 200});

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', message: error }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try{
    const token = req.cookies.get('token')?.value

    if(!token){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if(payload.role !== UserRole.ADMIN){
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();

    const exisitingLaboran = await prisma.laboran.findUnique({
      where: { id }
    })

    if(!exisitingLaboran){
      return NextResponse.json({ error: 'Laboran tidak ditemukan' }, { status: 404 });
    }

    await prisma.laboran.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Laboran berhasil dihapus' }, { status: 200 });



  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', message: error }, { status: 500 });
  }
}