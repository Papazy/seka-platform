import { prisma } from "@/lib/prisma";
import csvParser from "csv-parser";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

interface ParticipantCsvRow {
  nip?: string;
  npm?: string;
  nama: string;
  praktikum: string;
  kelas: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as "peserta" | "asisten" | "dosen";

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    //abmil file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    // console.log(formData);

    //baca isi
    const buffer = await file.arrayBuffer();
    const csvData = Buffer.from(buffer).toString("utf-8");

    const errors: string[] = [];
    // console.log('buffer,', buffer);
    // console.log('csvData,', csvData);

    const stream = Readable.from(csvData);
    // console.log('stream', stream);

    const parser = csvParser();
    const parsedData: ParticipantCsvRow[] = await new Promise(
      (resolve, reject) => {
        const data: ParticipantCsvRow[] = [];
        stream
          .pipe(parser)
          .on("data", row => data.push(row))
          .on("end", () => resolve(data))
          .on("error", reject);
      },
    );

    console.log("parsedData", parsedData);

    let imported = 0;

    for (const [index, row] of parsedData.entries()) {
      const rowNum = index + 2;
      // Validasi kolom wajib
      switch (type) {
        case "dosen":
          const requiredFieldsDosen: (keyof ParticipantCsvRow)[] = [
            "nip",
            "nama",
            "praktikum",
            "kelas",
          ];
          for (const field of requiredFieldsDosen) {
            if (!row[field]) {
              errors.push(
                `Baris ${rowNum - 1}: Kolom ${field} tidak boleh kosong`,
              );
              continue;
            }
          }
          break;
        case "peserta":
        case "asisten":
          const requiredFieldsPeserta: (keyof ParticipantCsvRow)[] = [
            "npm",
            "nama",
            "praktikum",
            "kelas",
          ];
          for (const field of requiredFieldsPeserta) {
            if (!row[field]) {
              errors.push(
                `Baris ${rowNum - 1}: Kolom ${field} tidak boleh kosong`,
              );
              continue;
            }
          }
          break;
      }
      // Cek apakah praktikum ada
      const praktikum = await prisma.praktikum.findFirst({
        where: {
          nama: row.praktikum,
          kelas: row.kelas,
        },
      });

      if (!praktikum) {
        errors.push(
          `Baris ${rowNum - 1}: Praktikum dengan nama ${row.praktikum} dan kelas ${row.kelas} tidak ditemukan`,
        );
        continue;
      }

      switch (type) {
        case "dosen":
          // Cek apakah dosen sudah ada
          const existingDosen = await prisma.dosen.findFirst({
            where: {
              OR: [{ nip: row.nip }],
            },
          });

          if (!existingDosen) {
            errors.push(`Baris ${rowNum - 1}: data dosen tidak ada`);
            continue;
          }
          // Cek apakah dosen sudah terdaftar di praktikum ini
          const existingDosenPraktikum = await prisma.dosenPraktikum.findFirst({
            where: {
              idPraktikum: praktikum.id,
              idDosen: existingDosen.id,
            },
          });

          if (existingDosenPraktikum) {
            errors.push(
              `Baris ${rowNum - 1}: Dosen sudah terdaftar di praktikum ini`,
            );
            continue;
          }

          // memasukkan dosen ke dalam praktikum
          try {
            await prisma.dosenPraktikum.create({
              data: {
                idPraktikum: praktikum.id,
                idDosen: existingDosen.id,
              },
            });
            imported++;
          } catch (error) {
            errors.push(
              `Baris ${rowNum - 1}: Gagal memasukkan dosen ke dalam praktikum - ${error}`,
            );
            continue;
          }
          break;
        case "peserta":
          const existingPeserta = await prisma.mahasiswa.findFirst({
            where: {
              npm: row.npm,
            },
          });
          if (!existingPeserta) {
            errors.push(
              `Baris ${rowNum - 1}: Mahasiswa dengan NPM ${row.npm} tidak ditemukan`,
            );
            continue;
          }

          const existingPesertaPraktikum =
            await prisma.pesertaPraktikum.findFirst({
              where: {
                idPraktikum: praktikum.id,
                idMahasiswa: existingPeserta.id,
              },
            });

          if (existingPesertaPraktikum) {
            errors.push(
              `Baris ${rowNum - 1}: Peserta sudah terdaftar di praktikum ini`,
            );
            continue;
          }

          try {
            await prisma.pesertaPraktikum.create({
              data: {
                idPraktikum: praktikum.id,
                idMahasiswa: existingPeserta.id,
              },
            });
            imported++;
          } catch (error) {
            errors.push(
              `Baris ${rowNum - 1}: Gagal memasukkan peserta ke dalam praktikum - ${error}`,
            );
            continue;
          }

          break;
        case "asisten":
          const existingAsisten = await prisma.mahasiswa.findFirst({
            where: {
              npm: row.npm,
            },
          });
          if (!existingAsisten) {
            errors.push(
              `Baris ${rowNum - 1}: Mahasiswa dengan NPM ${row.npm} tidak ditemukan`,
            );
            continue;
          }

          const existingAsistenPraktikum =
            await prisma.asistenPraktikum.findFirst({
              where: {
                idPraktikum: praktikum.id,
                idMahasiswa: existingAsisten.id,
              },
            });

          if (existingAsistenPraktikum) {
            errors.push(
              `Baris ${rowNum - 1}: asisten sudah terdaftar di praktikum ini`,
            );
            continue;
          }

          try {
            await prisma.asistenPraktikum.create({
              data: {
                idPraktikum: praktikum.id,
                idMahasiswa: existingAsisten.id,
              },
            });
            imported++;
          } catch (error) {
            errors.push(
              `Baris ${rowNum - 1}: Gagal memasukkan asisten ke dalam praktikum - ${error}`,
            );
            continue;
          }
      }
    }

    if (errors.length > 0 && imported === 0) {
      return NextResponse.json(
        {
          error: "Import gagal",
          errors: errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      imported,
      errors: errors,
      message: `${imported} data ${type} berhasil diimpor${errors.length > 0 ? ` dengan ${errors.length} error` : ""}`,
    });
  } catch (error) {
    console.error("Error in import participants: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
