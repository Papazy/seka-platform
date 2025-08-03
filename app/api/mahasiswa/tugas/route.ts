import { verifyToken } from "@/lib/auth";
import { getCurrentYearAndSemester } from "@/lib/getCurrentYearAndSemester";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const mahasiswaId = payload.id;
    const {semester, year} = getCurrentYearAndSemester()

    const tugasData = await prisma.tugas.findMany({
      where: {
        deadline: {
          gte: new Date() // tugas yang greate than, (deadline masih lama)
        },
        praktikum: {
          semester: semester as 'GENAP' | 'GANJIL',
          tahun: year,
          pesertaPraktikum: {
            some: {
              idMahasiswa: mahasiswaId
            }
          }
        }
      },
      include : {
        praktikum: true,
        soal : 
        {
          include: {
            submission: true
            // {
            //   where: {
            //     idPeserta: mahasiswaId,
            //   }
            // }
          }
        }
      },
      orderBy: {
        deadline: 'asc'
      }
    });

    const tugasWithTotalSoal = tugasData.map((tugas) => (
    {
      ...tugas,
      totalSoal : tugas.soal.length  
    }
    ))
    

    return NextResponse.json(tugasWithTotalSoal);


  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}