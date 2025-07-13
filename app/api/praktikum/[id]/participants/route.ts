import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const idPraktikum = params.id
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'all'
    const token = req.cookies.get('token')?.value


    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const idPraktikumInt = parseInt(idPraktikum) 

    const praktikum = await prisma.praktikum.findUnique({
      where: { id: idPraktikumInt },
      select: {
        id: true,
        nama: true,
        kelas: true,
      }
    });

    if (!praktikum) {
      return NextResponse.json({ error: 'Praktikum not found' }, { status: 404 });
    }

   
    let data = null
    let _count = null
    switch (type) {
      case 'peserta':
        data = await prisma.pesertaPraktikum.findMany({
          where: { idPraktikum: idPraktikumInt },
          select: {
            id: true,
            mahasiswa: {
              select: {
                id: true,
                npm: true,
                nama: true,
                programStudi: {
                  select: {
                    nama: true,
                    kodeProdi: true
                  }
                }
              }
            }
          }
        })

        data = mapMahasiswaData(data)

        _count = data.length
        
        break;
      case 'asisten':
        data = await prisma.asistenPraktikum.findMany({
          where: { idPraktikum: idPraktikumInt },
          select: {
            id: true,
            mahasiswa: {
              select: {
                id: true,
                npm: true,
                nama: true,
                programStudi: {
                  select: {
                    nama: true,
                    kodeProdi: true
                  }
                }
              }
            }
          }
        })
        
        data = mapMahasiswaData(data)
        _count = data.length
        break;
      case 'dosen':
        data = await prisma.dosenPraktikum.findMany({
          where: { idPraktikum: idPraktikumInt },
          select: {
            id: true,
            dosen: {
              select: {
                id: true,
                nip: true,
                nama: true,
                jabatan: true
              }
            }
          }
        })

        data = mapDosenData(data)
        _count = data.length
        break;

      default:
        const [pesertaData, asistenData, dosenData] = await Promise.all([
          prisma.pesertaPraktikum.findMany({
            where: {idPraktikum : idPraktikumInt},
            select : {
              id:true,
              mahasiswa: {
                select: {
                  id: true,
                  npm: true,
                  nama: true,
                  programStudi: {
                    select: {
                      nama: true,
                      kodeProdi: true
                    }
                  }
                }
              }
            }
          }),
          prisma.asistenPraktikum.findMany({
            where: {idPraktikum: idPraktikumInt},
            select : {
              id: true,
              mahasiswa: {
                select: {
                  nama: true,
                  npm: true,
                  id: true,
                  programStudi: {
                    select: {
                      nama: true,
                      kodeProdi: true
                    }
                  }
                }
              }
            }
          }),
          prisma.dosenPraktikum.findMany({
            where: {idPraktikum : idPraktikumInt},
            select: {
              id: true,
              dosen: {
                select: {
                  id: true,
                  nama: true,
                  nip: true,
                  jabatan: true
                }
              }
            }
          })
        ])

        data = {
          peserta: mapMahasiswaData(pesertaData),
          asisten: mapMahasiswaData(asistenData),
          dosen: mapDosenData(dosenData)
        }
        _count = {
          peserta: pesertaData.length,
          asisten: asistenData.length,
          dosen: dosenData.length
        }
      }

      if(!data){
        return NextResponse.json({ type, data:[], _count }, { status: 200 });
      }

      return NextResponse.json({ type, data, _count }, { status: 200 });

    }catch (error) {
      console.error('Error fetching participants: ', error);
      return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
    }
  }

  const mapMahasiswaData = (item: any[]) => {
    return item.map((data: any) => ({
      id: data.mahasiswa.id,
      npm: data.mahasiswa.npm,
      nama: data.mahasiswa.nama,
      programStudi: {
        nama: data.mahasiswa.programStudi?.nama || 'Tidak diketahui',
        kodeProdi: data.mahasiswa.programStudi?.kodeProdi || 'Tidak diketahui'
      }
    }))
  }

  const mapDosenData = (item: any[]) => {
    return item.map(data => ({
      id: data.dosen.id,
      nip: data.dosen.nip,
      nama: data.dosen.nama,
      jabatan: data.dosen.jabatan || 'Tidak diketahui'
    }))
  }