// prisma/seed.ts
import { PrismaClient, Semester } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🧹 Clearing existing data...")
  await prisma.$transaction([
    prisma.submission.deleteMany(),
    prisma.nilaiTugas.deleteMany(),
    prisma.soal.deleteMany(),
    prisma.tugas.deleteMany(),
    prisma.pesertaPraktikum.deleteMany(),
    prisma.asistenPraktikum.deleteMany(),
    prisma.dosenPraktikum.deleteMany(),
    prisma.praktikum.deleteMany(),
    prisma.mahasiswa.deleteMany(),
    prisma.dosen.deleteMany(),
    prisma.laboran.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.bahasaPemrograman.deleteMany(),
    prisma.programStudi.deleteMany(),
    prisma.fakultas.deleteMany(),
    prisma.pengaturanSistem.deleteMany(),
    ]);
}

async function main() {
  console.log("🌱 Starting seed...");
  
  // Helper function untuk hash password
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // 1. ✅ Pengaturan Sistem
  console.log("📊 Seeding system settings...");
  await prisma.pengaturanSistem.create({
    data: {
      currentSemester: Semester.GANJIL as Semester,
      currentYear: 2025,
    },
  });

  // 2. ✅ Fakultas
  console.log("🏛️ Seeding fakultas...");
  const fakultasData = [
    { nama: "Fakultas Ekonomi dan Bisnis", kodeFakultas: "FEB" },
    { nama: "Fakultas Kedokteran Hewan", kodeFakultas: "FKH" },
    { nama: "Fakultas Hukum", kodeFakultas: "FH" },
    { nama: "Fakultas Teknik", kodeFakultas: "FT" },
    { nama: "Fakultas Pertanian", kodeFakultas: "FP" },
    { nama: "Fakultas Keguruan dan Ilmu Pendidikan", kodeFakultas: "FKIP" },
    { nama: "Fakultas Kedokteran", kodeFakultas: "FK" },
    {
      nama: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
      kodeFakultas: "FMIPA",
    },
    { nama: "Fakultas Ilmu Sosial dan Ilmu Politik", kodeFakultas: "FISIP" },
    { nama: "Fakultas Kelautan dan Perikanan", kodeFakultas: "FKP" },
    { nama: "Fakultas Keperawatan", kodeFakultas: "FKEP" },
    { nama: "Fakultas Kedokteran Gigi", kodeFakultas: "FKG" },
  ];

  for (const fakultas of fakultasData) {
    await prisma.fakultas.upsert({
      where: { kodeFakultas: fakultas.kodeFakultas },
      update: {},
      create: fakultas,
    });
  }
  console.log("✅ Seeding fakultas selesai.");

  // 3. ✅ Seeding Program Studi
  console.log("🎓 Memulai seeding program studi...");

  // Mengambil semua ID fakultas untuk relasi
  const semuaFakultas = await prisma.fakultas.findMany();
  const idFakultasMap = semuaFakultas.reduce((map: any, fakultas) => {
    map[fakultas.kodeFakultas] = fakultas.id;
    return map;
  }, {});

  const programStudiData = [
    // FEB
    { nama: "Akuntansi", kodeProdi: "AKT", idFakultas: idFakultasMap["FEB"] },
    { nama: "Manajemen", kodeProdi: "MNJ", idFakultas: idFakultasMap["FEB"] },
    {
      nama: "Ekonomi Pembangunan",
      kodeProdi: "EP",
      idFakultas: idFakultasMap["FEB"],
    },
    {
      nama: "Ekonomi Islam",
      kodeProdi: "EI",
      idFakultas: idFakultasMap["FEB"],
    },

    // FKH
    {
      nama: "Pendidikan Dokter Hewan",
      kodeProdi: "PDH",
      idFakultas: idFakultasMap["FKH"],
    },

    // FH
    { nama: "Ilmu Hukum", kodeProdi: "IH", idFakultas: idFakultasMap["FH"] },

    // FT
    { nama: "Teknik Sipil", kodeProdi: "TS", idFakultas: idFakultasMap["FT"] },
    { nama: "Teknik Mesin", kodeProdi: "TM", idFakultas: idFakultasMap["FT"] },
    { nama: "Teknik Kimia", kodeProdi: "TK", idFakultas: idFakultasMap["FT"] },
    { nama: "Arsitektur", kodeProdi: "ARS", idFakultas: idFakultasMap["FT"] },
    {
      nama: "Teknik Elektro",
      kodeProdi: "TE",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Teknik Industri",
      kodeProdi: "TI",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Teknik Pertambangan",
      kodeProdi: "TP",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Teknik Geologi",
      kodeProdi: "TG",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Teknik Geofisika",
      kodeProdi: "TGF",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Teknik Komputer",
      kodeProdi: "TKOM",
      idFakultas: idFakultasMap["FT"],
    },
    {
      nama: "Perencanaan Wilayah dan Kota",
      kodeProdi: "PWK",
      idFakultas: idFakultasMap["FT"],
    },

    // FP
    {
      nama: "Agroteknologi",
      kodeProdi: "AGT",
      idFakultas: idFakultasMap["FP"],
    },
    { nama: "Agribisnis", kodeProdi: "AGB", idFakultas: idFakultasMap["FP"] },
    { nama: "Peternakan", kodeProdi: "PTR", idFakultas: idFakultasMap["FP"] },
    {
      nama: "Teknologi Hasil Pertanian",
      kodeProdi: "THP",
      idFakultas: idFakultasMap["FP"],
    },
    {
      nama: "Teknik Pertanian",
      kodeProdi: "TPT",
      idFakultas: idFakultasMap["FP"],
    },
    { nama: "Ilmu Tanah", kodeProdi: "IT", idFakultas: idFakultasMap["FP"] },
    {
      nama: "Proteksi Tanaman",
      kodeProdi: "PT",
      idFakultas: idFakultasMap["FP"],
    },
    { nama: "Kehutanan", kodeProdi: "KH", idFakultas: idFakultasMap["FP"] },

    // FKIP
    {
      nama: "Pendidikan Pancasila dan Kewarganegaraan",
      kodeProdi: "PPKN",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Sejarah",
      kodeProdi: "SEJ",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Ekonomi",
      kodeProdi: "EKO",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Geografi",
      kodeProdi: "GEO",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Bahasa dan Sastra Indonesia",
      kodeProdi: "PBSI",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Bahasa Inggris",
      kodeProdi: "PBI",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Biologi",
      kodeProdi: "BIO",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Matematika",
      kodeProdi: "MTK",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Fisika",
      kodeProdi: "FIS",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Kimia",
      kodeProdi: "KIM",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Guru Sekolah Dasar",
      kodeProdi: "PGSD",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Guru PAUD",
      kodeProdi: "PAUD",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Jasmani, Kesehatan, dan Rekreasi",
      kodeProdi: "PJKR",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Pendidikan Seni Drama, Tari, dan Musik",
      kodeProdi: "SDR",
      idFakultas: idFakultasMap["FKIP"],
    },
    {
      nama: "Bimbingan dan Konseling",
      kodeProdi: "BK",
      idFakultas: idFakultasMap["FKIP"],
    },

    // FK
    {
      nama: "Pendidikan Dokter",
      kodeProdi: "PD",
      idFakultas: idFakultasMap["FK"],
    },
    { nama: "Psikologi", kodeProdi: "PSI", idFakultas: idFakultasMap["FK"] },

    // FMIPA
    {
      nama: "Matematika",
      kodeProdi: "MAT",
      idFakultas: idFakultasMap["FMIPA"],
    },
    { nama: "Fisika", kodeProdi: "FSK", idFakultas: idFakultasMap["FMIPA"] },
    { nama: "Kimia", kodeProdi: "KMA", idFakultas: idFakultasMap["FMIPA"] },
    { nama: "Biologi", kodeProdi: "BIL", idFakultas: idFakultasMap["FMIPA"] },
    {
      nama: "Informatika",
      kodeProdi: "INF",
      idFakultas: idFakultasMap["FMIPA"],
    },
    {
      nama: "Manajemen Informatika",
      kodeProdi: "MI",
      idFakultas: idFakultasMap["FMIPA"],
    },
    {
      nama: "Statistika",
      kodeProdi: "STA",
      idFakultas: idFakultasMap["FMIPA"],
    },
    { nama: "Farmasi", kodeProdi: "FAR", idFakultas: idFakultasMap["FMIPA"] },

    // FISIP
    {
      nama: "Ilmu Politik",
      kodeProdi: "IP",
      idFakultas: idFakultasMap["FISIP"],
    },
    { nama: "Sosiologi", kodeProdi: "SOS", idFakultas: idFakultasMap["FISIP"] },
    {
      nama: "Ilmu Komunikasi",
      kodeProdi: "IKOM",
      idFakultas: idFakultasMap["FISIP"],
    },
    {
      nama: "Ilmu Pemerintahan",
      kodeProdi: "IPEM",
      idFakultas: idFakultasMap["FISIP"],
    },

    // FKP
    {
      nama: "Budidaya Perairan",
      kodeProdi: "BP",
      idFakultas: idFakultasMap["FKP"],
    },
    {
      nama: "Ilmu Kelautan",
      kodeProdi: "IK",
      idFakultas: idFakultasMap["FKP"],
    },
    {
      nama: "Pemanfaatan Sumber Daya Perikanan",
      kodeProdi: "PSP",
      idFakultas: idFakultasMap["FKP"],
    },

    // FKEP
    {
      nama: "Ilmu Keperawatan",
      kodeProdi: "IKEP",
      idFakultas: idFakultasMap["FKEP"],
    },

    // FKG
    {
      nama: "Pendidikan Dokter Gigi",
      kodeProdi: "PDG",
      idFakultas: idFakultasMap["FKG"],
    },
  ];

  for (const prodi of programStudiData) {
    await prisma.programStudi.upsert({
      where: { kodeProdi: prodi.kodeProdi },
      update: {},
      create: prodi,
    });
  }

  // 4. ✅ Bahasa Pemrograman
  console.log("💻 Seeding programming languages...");
  const languages = [
    { nama: "Python", ekstensi: ".py", compiler: "python3", versi: "3.11" },
    { nama: "Java", ekstensi: ".java", compiler: "javac", versi: "17" },
    { nama: "C++", ekstensi: ".cpp", compiler: "g++", versi: "6.3.0" },
    { nama: "C", ekstensi: ".c", compiler: "gcc", versi: "6.3.0" },
  ];

  for (const lang of languages) {
    await prisma.bahasaPemrograman.upsert({
      where: { nama: lang.nama },
      update: {},
      create: lang,
    });
  }

  // 5. ✅ Admin
  console.log("👑 Seeding admin...");
  await prisma.admin.upsert({
    where: { email: "admin@usk.ac.id" },
    update: {},
    create: {
      nama: "Dr. Budi Santoso",
      email: "admin@usk.ac.id",
      password: await hashPassword("admin123"),
    },
  });

  // 6. ✅ Laboran
  console.log("🔬 Seeding laboran...");
  const admin = await prisma.admin.findUnique({
    where: { email: "admin@usk.ac.id" },
  });

  await prisma.laboran.upsert({
    where: { email: "laboran@usk.ac.id" },
    update: {},
    create: {
      idAdmin: admin!.id,
      nama: "Ahmad Wijaya, S.Kom",
      email: "laboran@usk.ac.id",
      password: await hashPassword("laboran123"),
    },
  });

  // 7. ✅ Dosen
  console.log("👨‍🏫 Seeding dosen...");
  const prodiINF = await prisma.programStudi.findUnique({
    where: { kodeProdi: "INF" },
  });
  const prodiMAT = await prisma.programStudi.findUnique({
    where: { kodeProdi: "MAT" },
  });

  const dosenData = [
    {
      nip: "198801012015041001",
      nama: "Prof. Dr. Ir. Siti Nurhaliza, M.Kom",
      email: "siti.nurhaliza@usk.ac.id",
      jabatan: "Guru Besar",
      programStudiId: prodiINF!.id,
    },
    {
      nip: "198905152016051002",
      nama: "Dr. Eng. Andi Pratama, S.T., M.T.",
      email: "andi.pratama@usk.ac.id",
      jabatan: "Lektor Kepala",
      programStudiId: prodiINF!.id,
    },
    {
      nip: "199102201017061003",
      nama: "Dr. Rini Sari, S.Kom., M.Kom",
      email: "rini.sari@usk.ac.id",
      jabatan: "Lektor",
      programStudiId: prodiINF!.id,
    },
    {
      nip: "199304251018071004",
      nama: "Ir. Bambang Sutrisno, M.Sc",
      email: "bambang.sutrisno@usk.ac.id",
      jabatan: "Asisten Ahli",
      programStudiId: prodiMAT!.id,
    },
  ];

  for (const dosen of dosenData) {
    await prisma.dosen.upsert({
      where: { email: dosen.email },
      update: {},
      create: {
        ...dosen,
        password: await hashPassword("dosen123"),
      },
    });
  }

  // 8. ✅ Mahasiswa
  console.log("🎓 Seeding mahasiswa...");
  const mahasiswaData = [
    // Mahasiswa yang akan jadi asisten
    {
      npm: "2108107010001",
      nama: "Rizki Pratama",
      email: "rizki.pratama@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107010002",
      nama: "Sari Dewi",
      email: "sari.dewi@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107010003",
      nama: "Budi Setiawan",
      email: "budi.setiawan@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107010059",
      nama: "Fajry Ariansyah",
      email: "fajry@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },

    // Mahasiswa peserta - Pemrograman A
    {
      npm: "2108107030001",
      nama: "Andi Firmansyah",
      email: "andi.firmansyah@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030002",
      nama: "Diah Permata",
      email: "diah.permata@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030003",
      nama: "Cahyo Wibowo",
      email: "cahyo.wibowo@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030004",
      nama: "Indira Sari",
      email: "indira.sari@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030005",
      nama: "Fajar Nugroho",
      email: "fajar.nugroho@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },

    // Mahasiswa peserta - Pemrograman B
    {
      npm: "2108107030006",
      nama: "Putri Maharani",
      email: "putri.maharani@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030007",
      nama: "Yoga Pratama",
      email: "yoga.pratama@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030008",
      nama: "Lestari Dewi",
      email: "lestari.dewi@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030009",
      nama: "Arif Rahman",
      email: "arif.rahman@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107030010",
      nama: "Maya Sari",
      email: "maya.sari@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },

    // Mahasiswa peserta - SDA A
    {
      npm: "2108107020001",
      nama: "Dedi Kurniawan",
      email: "dedi.kurniawan@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020002",
      nama: "Eka Putri",
      email: "eka.putri@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020003",
      nama: "Fandi Wijaya",
      email: "fandi.wijaya@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020004",
      nama: "Gita Sari",
      email: "gita.sari@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020005",
      nama: "Hendra Gunawan",
      email: "hendra.gunawan@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },

    // Mahasiswa peserta - SDA B
    {
      npm: "2108107020006",
      nama: "Ira Wulandari",
      email: "ira.wulandari@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020007",
      nama: "Joko Santoso",
      email: "joko.santoso@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020008",
      nama: "Kiki Amelia",
      email: "kiki.amelia@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020009",
      nama: "Lukman Hakim",
      email: "lukman.hakim@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
    {
      npm: "2108107020010",
      nama: "Mila Kurnia",
      email: "mila.kurnia@mhs.usk.ac.id",
      programStudiId: prodiINF!.id,
    },
  ];

  for (const mahasiswa of mahasiswaData) {
    await prisma.mahasiswa.upsert({
      where: { email: mahasiswa.email },
      update: {},
      create: {
        ...mahasiswa,
        password: await hashPassword("mahasiswa123"),
      },
    });
  }

  // 9. ✅ Praktikum
  console.log("📚 Seeding praktikum...");
  const laboran = await prisma.laboran.findUnique({
    where: { email: "laboran@usk.ac.id" },
  });

  const praktikumData = [
    {
      nama: "Praktikum Pemrograman A",
      kodePraktikum: "PROG-A-2025-1",
      kodeMk: "TIF101",
      kelas: "A",
      semester: Semester.GENAP,
      tahun: 2025,
      jadwalHari: "Senin",
      jadwalJamMasuk: new Date("2025-07-06T08:00:00.000Z"),
      jadwalJamSelesai: new Date("2025-07-06T10:00:00.000Z"),
      ruang: "Lab Database",
    },
    {
      nama: "Praktikum Pemrograman B",
      kodePraktikum: "PROG-B-2025-1",
      kodeMk: "TIF101",
      kelas: "B",
      semester: Semester.GENAP,
      tahun: 2025,
      jadwalHari: "Selasa",
      jadwalJamMasuk: new Date("2025-07-07T08:00:00.000Z"),
      jadwalJamSelesai: new Date("2025-07-07T10:00:00.000Z"),
      ruang: "Lab SKJ",
    },
    {
      nama: "Praktikum Struktur Data dan Algoritma A",
      kodePraktikum: "SDA-A-2025-1",
      kodeMk: "TIF201",
      kelas: "A",
      semester: Semester.GENAP,
      tahun: 2025,
      jadwalHari: "Rabu",
      jadwalJamMasuk: new Date("2025-07-08T10:00:00.000Z"),
      jadwalJamSelesai: new Date("2025-07-08T12:00:00.000Z"),
      ruang: "Lab RPL",
    },
    {
      nama: "Praktikum Struktur Data dan Algoritma B",
      kodePraktikum: "SDA-B-2025-1",
      kodeMk: "TIF201",
      kelas: "B",
      semester: Semester.GENAP,
      tahun: 2025,
      jadwalHari: "Kamis",
      jadwalJamMasuk: new Date("2025-07-09T10:00:00.000Z"),
      jadwalJamSelesai: new Date("2025-07-09T12:00:00.000Z"),
      ruang: "Lab Geospasial",
    },
  ];

  for (const praktikum of praktikumData) {
    await prisma.praktikum.upsert({
      where: { kodePraktikum: praktikum.kodePraktikum },
      update: {},
      create: {
        ...praktikum,
        idLaboran: laboran!.id,
         semester: praktikum.semester as Semester,
      },
    });
  }

  // 10. ✅ Assign Dosen ke Praktikum
  console.log("👨‍🏫 Assigning dosen to praktikum...");
  const dosenList = await prisma.dosen.findMany();
  const praktikumList = await prisma.praktikum.findMany();

  const dosenAssignments = [
    { dosenEmail: "siti.nurhaliza@usk.ac.id", praktikumCode: "PROG-A-2025-1" },
    { dosenEmail: "andi.pratama@usk.ac.id", praktikumCode: "PROG-B-2025-1" },
    { dosenEmail: "rini.sari@usk.ac.id", praktikumCode: "SDA-A-2025-1" },
    { dosenEmail: "bambang.sutrisno@usk.ac.id", praktikumCode: "SDA-B-2025-1" },
  ];

  for (const assignment of dosenAssignments) {
    const dosen = dosenList.find(d => d.email === assignment.dosenEmail);
    const praktikum = praktikumList.find(
      p => p.kodePraktikum === assignment.praktikumCode,
    );

    if (dosen && praktikum) {
      await prisma.dosenPraktikum.upsert({
        where: {
          idDosen_idPraktikum: {
            idDosen: dosen.id,
            idPraktikum: praktikum.id,
          },
        },
        update: {},
        create: {
          idDosen: dosen.id,
          idPraktikum: praktikum.id,
        },
      });
    }
  }

  // 11. ✅ Assign Asisten ke Praktikum
  console.log("🎯 Assigning asisten to praktikum...");
  const mahasiswaList = await prisma.mahasiswa.findMany();

  const asistenAssignments = [
    { mahasiswaNpm: "2108107010001", praktikumCode: "PROG-A-2025-1" },
    { mahasiswaNpm: "2108107010059", praktikumCode: "PROG-B-2025-1" },
    { mahasiswaNpm: "2108107010003", praktikumCode: "SDA-A-2025-1" },
    { mahasiswaNpm: "2108107010002", praktikumCode: "SDA-B-2025-1" },
  ];

  for (const assignment of asistenAssignments) {
    const mahasiswa = mahasiswaList.find(
      m => m.npm === assignment.mahasiswaNpm,
    );
    const praktikum = praktikumList.find(
      p => p.kodePraktikum === assignment.praktikumCode,
    );

    if (mahasiswa && praktikum) {
      await prisma.asistenPraktikum.upsert({
        where: {
          idMahasiswa_idPraktikum: {
            idMahasiswa: mahasiswa.id,
            idPraktikum: praktikum.id,
          },
        },
        update: {},
        create: {
          idMahasiswa: mahasiswa.id,
          idPraktikum: praktikum.id,
        },
      });
    }
  }

  // 12. ✅ Assign Peserta ke Praktikum
  console.log("🎓 Assigning peserta to praktikum...");
  const pesertaAssignments = [
    // Pemrograman A
    {
      npmRange: ["2108107030001", "2108107030005"],
      praktikumCode: "PROG-A-2025-1",
    },
    // Pemrograman B
    {
      npmRange: ["2108107030006", "2108107030010"],
      praktikumCode: "PROG-B-2025-1",
    },
    // SDA A
    {
      npmRange: ["2108107020001", "2108107020005"],
      praktikumCode: "SDA-A-2025-1",
    },
    // SDA B
    {
      npmRange: ["2108107020006", "2108107020010"],
      praktikumCode: "SDA-B-2025-1",
    },
  ];

  for (const assignment of pesertaAssignments) {
    const praktikum = praktikumList.find(
      p => p.kodePraktikum === assignment.praktikumCode,
    );

    if (praktikum) {
      const pesertaInRange = mahasiswaList.filter(
        m => m.npm >= assignment.npmRange[0] && m.npm <= assignment.npmRange[1],
      );

      for (const peserta of pesertaInRange) {
        await prisma.pesertaPraktikum.upsert({
          where: {
            idMahasiswa_idPraktikum: {
              idMahasiswa: peserta.id,
              idPraktikum: praktikum.id,
            },
          },
          update: {},
          create: {
            idMahasiswa: peserta.id,
            idPraktikum: praktikum.id,
          },
        });
      }
    }
  }

  // masukkan npm 2108107010059 mejadi peserta praktikum Struktur Data A
  // masukkan juga ke praktikum Struktur data B
  const sdaAPraktikum = await prisma.praktikum.findUnique({
    where: { kodePraktikum: "SDA-A-2025-1" },
  });
  const sdaBPraktikum = await prisma.praktikum.findUnique({
    where: { kodePraktikum: "SDA-B-2025-1" },
  });
  const mahasiswaFajry = await prisma.mahasiswa.findUnique({
    where: { npm: "2108107010059" },
  });

  if (sdaAPraktikum && sdaBPraktikum && mahasiswaFajry) {
    await prisma.pesertaPraktikum.upsert({
      where: {
        idMahasiswa_idPraktikum: {
          idMahasiswa: mahasiswaFajry.id,
          idPraktikum: sdaAPraktikum.id,
        },
      },
      update: {},
      create: {
        idMahasiswa: mahasiswaFajry.id,
        idPraktikum: sdaAPraktikum.id,
      },
    });

    await prisma.pesertaPraktikum.upsert({
      where: {
        idMahasiswa_idPraktikum: {
          idMahasiswa: mahasiswaFajry.id,
          idPraktikum: sdaBPraktikum.id,
        },
      },
      update: {},
      create: {
        idMahasiswa: mahasiswaFajry.id,
        idPraktikum: sdaBPraktikum.id,
      },
    });
  }

  // 13. ✅ Create Sample Tugas dengan Markdown
  console.log("📝 Creating sample tugas...");
  const asistenList = await prisma.asistenPraktikum.findMany({
    include: { praktikum: true },
  });

  const tugasData = [
    // Pemrograman A
    {
      judul: "Tugas 1: Input Output dan Variabel",
      deskripsi: `# Praktikum Input Output dan Variabel

## Deskripsi
Praktikum pertama ini akan memperkenalkan konsep dasar dalam pemrograman yaitu **input**, **output**, dan **variabel**.

## Tujuan Pembelajaran
Setelah menyelesaikan praktikum ini, mahasiswa diharapkan dapat:
- Memahami cara menggunakan **input** dan **output** dalam program
- Mendeklarasikan dan menggunakan **variabel** dengan benar
- Melakukan operasi aritmatika sederhana
- Menerapkan konsep dasar pemrograman

## Petunjuk Umum
1. Bacalah setiap soal dengan **teliti**
2. Perhatikan format input dan output yang diminta
3. Gunakan template kode yang disediakan sebagai dasar
4. Test program Anda dengan contoh test case sebelum submit
5. Maksimal **3 kali submit** untuk setiap soal

## Kriteria Penilaian
- **Correctness** (70%): Program menghasilkan output yang benar
- **Code Quality** (20%): Kode mudah dibaca dan efisien  
- **Compliance** (10%): Mengikuti format yang diminta

> **⚠️ Deadline**: 20 Juli 2025, 23:59:59`,
      praktikumCode: "PROG-A-2025-1",
      deadline: new Date("2025-07-20T23:59:59.000Z"),
      maksimalSubmit: 3,
    },
    {
      judul: "Tugas 2: Percabangan dan Kondisi",
      deskripsi: `# Praktikum Percabangan dan Kondisi

## Deskripsi
Praktikum ini membahas tentang **struktur kontrol percabangan** dalam pemrograman menggunakan **if-else**, **switch case**, dan **operator logika**.

## Tujuan Pembelajaran
Setelah menyelesaikan praktikum ini, mahasiswa diharapkan dapat:
- Memahami konsep **conditional statements**
- Menggunakan **if-else** untuk membuat keputusan dalam program
- Menerapkan **operator perbandingan** dan **operator logika**
- Membuat program dengan **multiple conditions**

## Konsep yang Dipelajari
### 1. If-Else Statement
\`\`\`python
if condition:
    # code block
else:
    # code block
\`\`\`

### 2. Nested If
\`\`\`python
if condition1:
    if condition2:
        # nested code
\`\`\`

### 3. Operator Perbandingan
- \`==\` (sama dengan)
- \`!=\` (tidak sama dengan)  
- \`>\`, \`<\`, \`>=\`, \`<=\`

## Tips Pengerjaan
1. Gunakan **indentasi** yang benar
2. Perhatikan **logical flow** program
3. Test dengan berbagai **edge cases**

> **⚠️ Deadline**: 27 Juli 2025, 23:59:59`,
      praktikumCode: "PROG-A-2025-1",
      deadline: new Date("2025-07-27T23:59:59.000Z"),
      maksimalSubmit: 3,
    },
    // Pemrograman B
    {
      judul: "Tugas 1: Looping dan Perulangan",
      deskripsi: `# Praktikum Looping dan Perulangan

## Deskripsi
Praktikum ini membahas tentang **struktur perulangan** (loops) dalam pemrograman menggunakan **for loop**, **while loop**, dan **do-while loop**.

## Tujuan Pembelajaran
- Memahami konsep **iterasi** dalam pemrograman
- Menggunakan **for loop** untuk perulangan dengan jumlah tertentu
- Menggunakan **while loop** untuk perulangan dengan kondisi
- Menyelesaikan masalah menggunakan **nested loops**

## Jenis Perulangan

### 1. For Loop
\`\`\`python
for i in range(n):
    print(i)
\`\`\`

### 2. While Loop  
\`\`\`python
i = 0
while i < n:
    print(i)
    i += 1
\`\`\`

### 3. Nested Loop
\`\`\`python
for i in range(n):
    for j in range(m):
        print(i, j)
\`\`\`

## Aplikasi Perulangan
- Menampilkan **deret bilangan**
- Menghitung **faktorial**
- Membuat **pola output**
- Melakukan **akumulasi data**

> **📚 Tip**: Pastikan loop memiliki **kondisi berhenti** yang jelas!`,
      praktikumCode: "PROG-B-2025-1",
      deadline: new Date("2025-07-21T23:59:59.000Z"),
      maksimalSubmit: 3,
    },
    {
      judul: "Tugas 2: Array dan String",
      deskripsi: `# Praktikum Array dan String

## Deskripsi
Praktikum tentang **manipulasi array** dan **string processing** untuk mengelola koleksi data dan teks.

## Tujuan Pembelajaran
- Memahami konsep **array/list** sebagai struktur data
- Melakukan operasi dasar pada **array**
- Memahami **string manipulation**
- Menggabungkan array dan string dalam pemecahan masalah

## Operasi Array
### Deklarasi dan Inisialisasi
\`\`\`python
# List kosong
arr = []

# List dengan nilai awal
arr = [1, 2, 3, 4, 5]
\`\`\`

### Operasi Dasar
- **Append**: \`arr.append(value)\`
- **Insert**: \`arr.insert(index, value)\`
- **Remove**: \`arr.remove(value)\`
- **Access**: \`arr[index]\`

## String Operations
### Metode String
- **Length**: \`len(string)\`
- **Split**: \`string.split()\`
- **Join**: \`separator.join(list)\`
- **Replace**: \`string.replace(old, new)\`

## Contoh Penggunaan
\`\`\`python
# Array processing
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)

# String processing  
text = "Hello World"
words = text.split()
\`\`\`

> **💡 Remember**: Array indexing dimulai dari **0**!`,
      praktikumCode: "PROG-B-2025-1",
      deadline: new Date("2025-07-28T23:59:59.000Z"),
      maksimalSubmit: 3,
    },
    // SDA A
    {
      judul: "Tugas 1: Stack dan Queue",
      deskripsi: `# Praktikum Stack dan Queue

## Deskripsi
Implementasi **struktur data linear** yaitu **Stack** (LIFO - Last In First Out) dan **Queue** (FIFO - First In First Out) beserta operasi-operasinya.

## Tujuan Pembelajaran
- Memahami karakteristik **Stack** dan **Queue**
- Mengimplementasikan operasi dasar **Push**, **Pop**, **Peek**
- Mengimplementasikan operasi **Enqueue**, **Dequeue**, **Front**
- Menerapkan Stack dan Queue untuk menyelesaikan masalah

## Stack (Tumpukan)
### Karakteristik
- **LIFO**: Last In First Out
- Elemen terakhir yang masuk adalah yang pertama keluar
- Seperti **tumpukan piring**

### Operasi Stack
\`\`\`python
# Implementasi dengan List
stack = []

# Push - menambah elemen
stack.append(item)

# Pop - mengeluarkan elemen teratas  
top_item = stack.pop()

# Peek - melihat elemen teratas tanpa mengeluarkan
top_item = stack[-1] if stack else None
\`\`\`

## Queue (Antrian)
### Karakteristik  
- **FIFO**: First In First Out
- Elemen pertama yang masuk adalah yang pertama keluar
- Seperti **antrian di kasir**

### Operasi Queue
\`\`\`python
from collections import deque

# Implementasi dengan deque
queue = deque()

# Enqueue - menambah elemen di belakang
queue.append(item)

# Dequeue - mengeluarkan elemen di depan
front_item = queue.popleft()

# Front - melihat elemen depan
front_item = queue[0] if queue else None
\`\`\`

## Aplikasi Praktis
### Stack
- **Function call stack**
- **Undo operations** 
- **Expression evaluation**
- **Balanced parentheses checking**

### Queue
- **Task scheduling**
- **Breadth-first search**
- **Buffer untuk I/O**
- **Print queue**

## Kompleksitas Waktu
| Operasi | Stack | Queue |
|---------|-------|-------|
| Push/Enqueue | O(1) | O(1) |
| Pop/Dequeue | O(1) | O(1) |
| Peek/Front | O(1) | O(1) |

> **⚡ Performance Tip**: Gunakan \`collections.deque\` untuk implementasi Queue yang efisien!`,
      praktikumCode: "SDA-A-2025-1",
      deadline: new Date("2025-07-22T23:59:59.000Z"),
      maksimalSubmit: 5,
    },
    {
      judul: "Tugas 2: Sorting Algorithm",
      deskripsi: `# Praktikum Algoritma Sorting

## Deskripsi
Implementasi **algoritma pengurutan** (sorting) yaitu **Bubble Sort**, **Insertion Sort**, dan **Selection Sort** untuk mengurutkan data.

## Tujuan Pembelajaran
- Memahami konsep **algoritma sorting**
- Mengimplementasikan berbagai **algoritma sorting** sederhana
- Menganalisis **kompleksitas waktu** dan **ruang**
- Membandingkan **performa** algoritma sorting

## Bubble Sort
### Konsep
- Membandingkan **elemen bersebelahan**
- **Menukar posisi** jika tidak sesuai urutan
- Elemen terbesar akan "**menggelembung**" ke akhir

### Algoritma
\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
\`\`\`

### Kompleksitas
- **Time**: O(n²)
- **Space**: O(1)

## Selection Sort
### Konsep
- Mencari elemen **terkecil** dalam array
- **Menukar** dengan elemen pertama
- Mengulangi untuk subarray sisanya

### Algoritma
\`\`\`python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
\`\`\`

### Kompleksitas
- **Time**: O(n²)
- **Space**: O(1)

## Insertion Sort
### Konsep
- Membangun **sorted portion** secara bertahap
- **Menyisipkan** elemen ke posisi yang tepat
- Efisien untuk **dataset kecil**

### Algoritma
\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
\`\`\`

### Kompleksitas
- **Time**: O(n²) worst case, O(n) best case
- **Space**: O(1)

## Perbandingan Algoritma

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable |
|-----------|-----------|--------------|------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |

## Kapan Menggunakan?
### Bubble Sort
- **Educational purposes**
- Dataset sangat kecil
- Stabilitas diperlukan

### Selection Sort  
- **Memory terbatas**
- Minimalisir **swap operations**
- Tidak peduli stabilitas

### Insertion Sort
- Dataset **hampir terurut**
- **Online algorithm** (data datang bertahap)
- Sebagai **hybrid** dengan algoritma lain

> **🎯 Optimization**: Untuk production, gunakan algoritma yang lebih efisien seperti **Quick Sort** atau **Merge Sort**!`,
      praktikumCode: "SDA-A-2025-1",
      deadline: new Date("2025-07-29T23:59:59.000Z"),
      maksimalSubmit: 5,
    },
    // SDA B
    {
      judul: "Tugas 1: Linked List",
      deskripsi: `# Praktikum Linked List

## Deskripsi
Implementasi **struktur data linear dinamis** yaitu **Single Linked List** dan **Double Linked List**.

## Tujuan Pembelajaran
- Memahami konsep **pointer** dan **dynamic memory**
- Mengimplementasikan **Single Linked List**
- Mengimplementasikan **Double Linked List**
- Melakukan operasi **insertion**, **deletion**, dan **traversal**

## Single Linked List
### Struktur Node
\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
\`\`\`

### Operasi Dasar
\`\`\`python
class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        if not self.head:
            return
        
        if self.head.data == data:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next
\`\`\`

## Double Linked List
### Struktur Node
\`\`\`python
class DNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None
\`\`\`

### Keunggulan
- **Bidirectional traversal**
- **Easier deletion** (jika punya referensi node)
- **Flexible operations**

## Perbandingan dengan Array

| Aspek | Array | Linked List |
|-------|-------|-------------|
| Memory | **Contiguous** | **Scattered** |
| Access Time | **O(1)** | **O(n)** |
| Insertion | **O(n)** | **O(1)** |
| Deletion | **O(n)** | **O(1)** |
| Memory Overhead | **Low** | **High** |

## Aplikasi Praktis
- **Dynamic arrays**
- **Undo functionality**
- **Music playlist**
- **Browser history**
- **Implementation of other data structures**

> **💡 Memory Tip**: Linked List menggunakan memori secara dinamis, cocok untuk data dengan ukuran yang tidak diketahui!`,
      praktikumCode: "SDA-B-2025-1",
      deadline: new Date("2025-07-23T23:59:59.000Z"),
      maksimalSubmit: 5,
    },
    {
      judul: "Tugas 2: Tree dan Graph",
      deskripsi: `# Praktikum Tree dan Graph

## Deskripsi
Implementasi **struktur data non-linear** yaitu **Binary Tree** dan operasi dasar **Graph**.

## Tujuan Pembelajaran
- Memahami konsep **hierarchical data structure**
- Mengimplementasikan **Binary Tree**
- Melakukan **tree traversal** (inorder, preorder, postorder)
- Memahami representasi **Graph**
- Mengimplementasikan **graph traversal** (DFS, BFS)

## Binary Tree
### Struktur Node
\`\`\`python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
\`\`\`

### Tree Traversal
#### 1. Inorder (Left → Root → Right)
\`\`\`python
def inorder(root):
    if root:
        inorder(root.left)
        print(root.data)
        inorder(root.right)
\`\`\`

#### 2. Preorder (Root → Left → Right)
\`\`\`python
def preorder(root):
    if root:
        print(root.data)
        preorder(root.left)
        preorder(root.right)
\`\`\`

#### 3. Postorder (Left → Right → Root)
\`\`\`python
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.data)
\`\`\`

## Graph Representation
### 1. Adjacency List
\`\`\`python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}
\`\`\`

### 2. Adjacency Matrix
\`\`\`python
# For n vertices
matrix = [[0 for _ in range(n)] for _ in range(n)]
matrix[i][j] = 1  # Edge from vertex i to vertex j
\`\`\`

## Graph Traversal
### Depth-First Search (DFS)
\`\`\`python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
\`\`\`

### Breadth-First Search (BFS)
\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

## Aplikasi Praktis

### Tree Applications
- **File systems**
- **Expression parsing**
- **Database indexing**
- **Decision trees**
- **Huffman coding**

### Graph Applications  
- **Social networks**
- **Maps and navigation**
- **Network topology**
- **Dependency resolution**
- **Recommendation systems**

## Kompleksitas
| Operation | Binary Tree | Graph (V=vertices, E=edges) |
|-----------|-------------|---------------------------|
| Search | O(log n) - O(n) | O(V + E) |
| Insertion | O(log n) - O(n) | O(1) |
| Traversal | O(n) | O(V + E) |
| Space | O(n) | O(V + E) |

> **🌳 Tree Tip**: Binary Search Tree memberikan pencarian yang efisien jika **balanced**!  
> **🔗 Graph Tip**: Pilih representasi graph berdasarkan **density** - Adjacency List untuk sparse, Matrix untuk dense!`,
      praktikumCode: "SDA-B-2025-1",
      deadline: new Date("2025-07-30T23:59:59.000Z"),
      maksimalSubmit: 5,
    },
  ];

  for (const tugas of tugasData) {
    const asisten = asistenList.find(
      a => a.praktikum.kodePraktikum === tugas.praktikumCode,
    );

    if (asisten) {
      await prisma.tugas.create({
        data: {
          judul: tugas.judul,
          deskripsi: tugas.deskripsi,
          deadline: tugas.deadline,
          maksimalSubmit: tugas.maksimalSubmit,
          idPraktikum: asisten.idPraktikum,
          idAsisten: asisten.id,
        },
      });
    }
  }

  // 14. ✅ Create Sample Soal dengan Markdown
  console.log("🧩 Creating sample soal dan test case...");

  let tugasList = await prisma.tugas.findMany({
    include: { praktikum: true },
  });

  const bahasaDidukung = ["Python", "c++", "c", "java"];
  // Helper untuk mendapatkan bahasa Python
  const pythonLang = await prisma.bahasaPemrograman.findMany({
    where: { nama: { in: bahasaDidukung } },
  });

  // ===== SOAL PEMROGRAMAN A =====
  // Tugas 1: Input Output dan Variabel
  const progATugas1 = tugasList.find(
    t =>
      t.praktikum.kodePraktikum === "PROG-A-2025-1" &&
      t.judul.includes("Input Output"),
  );

  if (progATugas1) {
    // Soal 1: Hello World
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: "Hello World",
        deskripsi: `# Hello World

## Deskripsi Masalah
Buatlah program sederhana yang menampilkan teks **"Hello World!"** ke layar. Ini adalah program pertama yang biasanya dipelajari dalam pemrograman.

## Tujuan
- Memahami struktur dasar program
- Mengenal fungsi **output** dalam pemrograman
- Menjalankan program pertama Anda

## Contoh Program
\`\`\`python
print("Hello World!")
\`\`\`

> **💡 Tips**: Pastikan output Anda **persis sama** dengan yang diminta, termasuk tanda baca dan kapitalisasi!`,
        batasan: "Tidak ada batasan khusus untuk soal ini.",
        formatInput: "Tidak ada input yang diperlukan.",
        formatOutput: 'Tampilkan teks "Hello World!" (tanpa tanda kutip).',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'print("Hello World!")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Hello World
    await prisma.testCase.create({
      data: {
        idSoal: soal1.id,
        input: "",
        outputDiharapkan: "Hello World!",
      },
    });

    // Contoh test case untuk Hello World
    await prisma.contohTestCase.create({
      data: {
        idSoal: soal1.id,
        contohInput: "",
        contohOutput: "Hello World!",
        penjelasanInput: "Tidak ada input yang diperlukan untuk program ini.",
        penjelasanOutput:
          'Program harus menampilkan teks "Hello World!" persis seperti contoh di atas.',
      },
    });

    // Soal 2: Penjumlahan Sederhana
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: "Penjumlahan Sederhana",
        deskripsi: `# Penjumlahan Dua Bilangan

## Deskripsi Masalah
Buatlah program yang membaca **dua bilangan bulat** dari input, kemudian menampilkan **hasil penjumlahannya**.

## Tujuan
- Memahami cara membaca **input** dari user
- Melakukan operasi **aritmatika** sederhana
- Menampilkan **output** hasil perhitungan

## Langkah-langkah
1. Baca dua bilangan bulat **A** dan **B**
2. Hitung **A + B**
3. Tampilkan hasilnya

## Contoh Implementasi
\`\`\`python
# Membaca input
A, B = map(int, input().split())

# Menghitung dan menampilkan hasil
print(A + B)
\`\`\`

> **📝 Catatan**: Gunakan \`input().split()\` untuk membaca dua bilangan dalam satu baris yang dipisahkan spasi.`,
        batasan: `- Bilangan A dan B adalah bilangan bulat
- **-1000 ≤ A, B ≤ 1000**
- Input terdiri dari dua bilangan dalam satu baris`,
        formatInput:
          "Dua bilangan bulat **A** dan **B** dalam satu baris, dipisahkan oleh spasi.",
        formatOutput: "Satu bilangan bulat yang merupakan hasil **A + B**.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: "A, B = map(int, input().split())\nprint(A + B)",
        bobotNilai: 100,
      },
    });

    // Test case untuk Penjumlahan
    const testCasesPenjumlahan = [
      { input: "5 3", output: "8" },
      { input: "10 -2", output: "8" },
      { input: "0 0", output: "0" },
      { input: "-5 -3", output: "-8" },
    ];

    for (const testCase of testCasesPenjumlahan) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Contoh test case untuk Penjumlahan
    await prisma.contohTestCase.create({
      data: {
        idSoal: soal2.id,
        contohInput: "5 3",
        contohOutput: "8",
        penjelasanInput: "Input terdiri dari dua bilangan: **5** dan **3**",
        penjelasanOutput: "Hasil penjumlahan: **5 + 3 = 8**",
      },
    });

    // Soal 3: Luas Persegi Panjang
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: "Luas Persegi Panjang",
        deskripsi: `# Menghitung Luas Persegi Panjang

## Deskripsi Masalah
Buatlah program yang menghitung **luas persegi panjang** berdasarkan **panjang** dan **lebar** yang diinputkan.

## Formula Matematika
\`\`\`
Luas = Panjang × Lebar
\`\`\`

## Tujuan
- Menerapkan **rumus matematika** dalam program
- Melakukan **perkalian** dua bilangan
- Menggunakan variabel untuk menyimpan hasil perhitungan

## Contoh Kasus
Jika panjang = **5** dan lebar = **4**, maka:
- Luas = 5 × 4 = **20**

## Implementasi
\`\`\`python
# Input
panjang, lebar = map(int, input().split())

# Perhitungan
luas = panjang * lebar

# Output
print(luas)
\`\`\`

> **🔢 Tips Matematika**: Pastikan Anda memahami konsep luas persegi panjang sebelum coding!`,
        batasan: `- Panjang dan lebar adalah **bilangan bulat positif**
- **1 ≤ panjang, lebar ≤ 100**
- Hasil luas tidak akan melebihi batas integer`,
        formatInput:
          "Dua bilangan bulat **panjang** dan **lebar** dalam satu baris, dipisahkan spasi.",
        formatOutput:
          "Satu bilangan bulat yang merupakan **luas persegi panjang**.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          "panjang, lebar = map(int, input().split())\nprint(panjang * lebar)",
        bobotNilai: 100,
      },
    });

    // Test case untuk Luas Persegi Panjang
    const testCasesLuas = [
      { input: "5 4", output: "20" },
      { input: "10 3", output: "30" },
      { input: "1 1", output: "1" },
      { input: "7 8", output: "56" },
    ];

    for (const testCase of testCasesLuas) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 4: Gaji Karyawan
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: "Gaji Karyawan",
        deskripsi: `# Menghitung Gaji Karyawan

## Deskripsi Masalah
Buatlah program untuk menghitung **total gaji karyawan** berdasarkan **jam kerja** dan **upah per jam**.

## Formula Perhitungan
\`\`\`
Total Gaji = Jam Kerja × Upah per Jam
\`\`\`

## Tujuan
- Menerapkan perhitungan dalam **konteks nyata**
- Menggunakan **perkalian** untuk menghitung total
- Memahami aplikasi programming dalam **dunia kerja**

## Contoh Skenario
Seorang karyawan bekerja selama **40 jam** dengan upah **Rp 50.000** per jam:
- Total Gaji = 40 × 50.000 = **Rp 2.000.000**

## Implementasi
\`\`\`python
# Input: jam kerja dan upah per jam
jam_kerja, upah_per_jam = map(int, input().split())

# Perhitungan gaji
total_gaji = jam_kerja * upah_per_jam

# Output
print(total_gaji)
\`\`\`

> **💰 Real World**: Program seperti ini sering digunakan dalam sistem **payroll** perusahaan!`,
        batasan: `- Jam kerja: **1 ≤ jam_kerja ≤ 168** (maksimal 24 jam × 7 hari)
- Upah per jam: **1 ≤ upah_per_jam ≤ 100.000**
- Semua input adalah bilangan bulat positif`,
        formatInput:
          "Dua bilangan bulat **jam_kerja** dan **upah_per_jam** dalam satu baris, dipisahkan spasi.",
        formatOutput: "Satu bilangan bulat yang merupakan **total gaji**.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          "jam_kerja, upah_per_jam = map(int, input().split())\nprint(jam_kerja * upah_per_jam)",
        bobotNilai: 100,
      },
    });

    // Test case untuk Gaji Karyawan
    const testCasesGaji = [
      { input: "40 50000", output: "2000000" },
      { input: "35 75000", output: "2625000" },
      { input: "20 25000", output: "500000" },
    ];

    for (const testCase of testCasesGaji) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }
  }

  // Tugas 2: Percabangan dan Kondisi
  const progATugas2 = tugasList.find(
    t =>
      t.praktikum.kodePraktikum === "PROG-A-2025-1" &&
      t.judul.includes("Percabangan"),
  );

  if (progATugas2) {
    // Soal 1: Bilangan Genap Ganjil
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: "Bilangan Genap atau Ganjil",
        deskripsi: `# Menentukan Bilangan Genap atau Ganjil

## Deskripsi Masalah
Buatlah program yang menentukan apakah sebuah **bilangan bulat** adalah **genap** atau **ganjil**.

## Konsep Matematika
- **Bilangan Genap**: Habis dibagi 2 (sisa bagi = 0)
- **Bilangan Ganjil**: Tidak habis dibagi 2 (sisa bagi = 1)

## Operator Modulo (%)
Operator **%** memberikan **sisa hasil bagi**:
- \`10 % 2 = 0\` (genap)
- \`11 % 2 = 1\` (ganjil)

## Implementasi
\`\`\`python
n = int(input())

if n % 2 == 0:
    print("GENAP")
else:
    print("GANJIL")
\`\`\`

## Logika Program
1. Baca bilangan **n**
2. Cek \`n % 2\`:
   - Jika **0** → bilangan genap
   - Jika **1** → bilangan ganjil
3. Tampilkan hasil

> **🧮 Math Tip**: Bilangan negatif juga mengikuti aturan yang sama untuk genap/ganjil!`,
        batasan: `- **-1000 ≤ n ≤ 1000**
- Input berupa satu bilangan bulat
- Output harus **PERSIS** "GENAP" atau "GANJIL"`,
        formatInput: "Satu bilangan bulat **n**.",
        formatOutput:
          '**"GENAP"** jika bilangan genap, **"GANJIL"** jika bilangan ganjil.',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          'n = int(input())\nif n % 2 == 0:\n    print("GENAP")\nelse:\n    print("GANJIL")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Genap Ganjil
    const testCasesGenapGanjil = [
      { input: "4", output: "GENAP" },
      { input: "7", output: "GANJIL" },
      { input: "0", output: "GENAP" },
      { input: "-3", output: "GANJIL" },
    ];

    for (const testCase of testCasesGenapGanjil) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 2: Nilai Ujian - Grade
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: "Sistem Penilaian Grade",
        deskripsi: `# Sistem Penilaian Grade

## Deskripsi Masalah
Buatlah program yang menentukan **grade** berdasarkan **nilai ujian** dengan ketentuan berikut:

| Rentang Nilai | Grade |
|---------------|-------|
| 90 - 100 | **A** |
| 80 - 89  | **B** |
| 70 - 79  | **C** |
| 60 - 69  | **D** |
| 0 - 59   | **E** |

## Konsep If-Elif-Else
Program ini menggunakan **multiple conditions** dengan struktur:

\`\`\`python
if condition1:
    # action1
elif condition2:
    # action2
elif condition3:
    # action3
else:
    # default action
\`\`\`

## Implementasi
\`\`\`python
nilai = int(input())

if nilai >= 90:
    print("A")
elif nilai >= 80:
    print("B")
elif nilai >= 70:
    print("C")
elif nilai >= 60:
    print("D")
else:
    print("E")
\`\`\`

## Logika Urutan
Urutan kondisi **sangat penting**:
1. Cek dari nilai **tertinggi** ke **terendah**
2. Kondisi pertama yang **True** akan dieksekusi
3. Kondisi selanjutnya akan **diabaikan**

> **⚠️ Important**: Urutan \`elif\` harus dari nilai terbesar ke terkecil!`,
        batasan: `- **0 ≤ nilai ≤ 100**
- Input berupa bilangan bulat
- Output berupa satu huruf: A, B, C, D, atau E`,
        formatInput: "Satu bilangan bulat **nilai** (0-100).",
        formatOutput: "Satu huruf **grade**: A, B, C, D, atau E.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          'nilai = int(input())\nif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelif nilai >= 60:\n    print("D")\nelse:\n    print("E")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Nilai Ujian
    const testCasesNilai = [
      { input: "95", output: "A" },
      { input: "85", output: "B" },
      { input: "75", output: "C" },
      { input: "65", output: "D" },
      { input: "55", output: "E" },
    ];

    for (const testCase of testCasesNilai) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 3: Bilangan Terbesar
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: "Mencari Bilangan Terbesar",
        deskripsi: `# Mencari Bilangan Terbesar dari Tiga Bilangan

## Deskripsi Masalah
Buatlah program yang menentukan **bilangan terbesar** dari **tiga bilangan bulat** yang diinputkan.

## Pendekatan Solusi

### Metode 1: Menggunakan Fungsi Built-in
\`\`\`python
a, b, c = map(int, input().split())
print(max(a, b, c))
\`\`\`

### Metode 2: Menggunakan If-Else
\`\`\`python
a, b, c = map(int, input().split())

if a >= b and a >= c:
    print(a)
elif b >= a and b >= c:
    print(b)
else:
    print(c)
\`\`\`

### Metode 3: Perbandingan Bertahap
\`\`\`python
a, b, c = map(int, input().split())

terbesar = a
if b > terbesar:
    terbesar = b
if c > terbesar:
    terbesar = c

print(terbesar)
\`\`\`

## Operator Logika
- **and**: Kedua kondisi harus True
- **or**: Salah satu kondisi True
- **>=**: Lebih besar atau sama dengan

## Test Case Edge
- Semua bilangan sama: \`5 5 5\` → **5**
- Dua bilangan sama: \`5 5 3\` → **5**
- Bilangan negatif: \`-1 -5 -3\` → **-1**

> **💡 Tip**: Fungsi \`max()\` adalah cara paling efisien untuk masalah ini!`,
        batasan: `- **-1000 ≤ a, b, c ≤ 1000**
- Input berupa tiga bilangan bulat dalam satu baris
- Jika ada bilangan yang sama, pilih salah satu`,
        formatInput:
          "Tiga bilangan bulat **a**, **b**, dan **c** dalam satu baris, dipisahkan spasi.",
        formatOutput:
          "Satu bilangan bulat yang merupakan **bilangan terbesar**.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          "a, b, c = map(int, input().split())\nprint(max(a, b, c))",
        bobotNilai: 100,
      },
    });

    // Test case untuk Bilangan Terbesar
    const testCasesTerbesar = [
      { input: "5 3 8", output: "8" },
      { input: "10 15 7", output: "15" },
      { input: "2 2 2", output: "2" },
      { input: "-1 -5 -3", output: "-1" },
    ];

    for (const testCase of testCasesTerbesar) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 4: Kalkulator Sederhana
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: "Kalkulator Sederhana",
        deskripsi: `# Kalkulator Sederhana

## Deskripsi Masalah
Buatlah program **kalkulator sederhana** yang dapat melakukan operasi **aritmatika dasar**: penjumlahan (+), pengurangan (-), perkalian (*), dan pembagian (/).

## Operasi yang Didukung
| Operator | Operasi | Contoh |
|----------|---------|--------|
| **+** | Penjumlahan | \`5 + 3 = 8\` |
| **-** | Pengurangan | \`5 - 3 = 2\` |
| **\*** | Perkalian | \`5 * 3 = 15\` |
| **/** | Pembagian | \`6 / 3 = 2\` |

## Format Input
Input terdiri dari **tiga bagian**:
1. **Bilangan pertama** (integer)
2. **Operator** (string: "+", "-", "*", "/")
3. **Bilangan kedua** (integer)

## Implementasi
\`\`\`python
a, op, b = input().split()
a, b = int(a), int(b)

if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    print(a // b)  # Pembagian integer
\`\`\`

## Catatan Pembagian
- Gunakan **pembagian integer** (\`//\`)
- Hasil berupa **bilangan bulat** (bukan decimal)
- Contoh: \`7 / 3 = 2\` (bukan 2.33...)

## Error Handling
- **Tidak ada pembagian dengan 0** dalam test case
- Semua input **dijamin valid**

> **🔢 Programming Tip**: Parsing string input dengan \`split()\` sangat berguna untuk format seperti ini!`,
        batasan: `- **-1000 ≤ a, b ≤ 1000**
- Operator: hanya "+", "-", "*", "/"
- Tidak ada pembagian dengan 0
- Hasil pembagian berupa bilangan bulat`,
        formatInput:
          "Bilangan pertama, operator, bilangan kedua dalam satu baris dipisahkan spasi.\nFormat: **a op b**",
        formatOutput: "Satu bilangan bulat hasil operasi.",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          'a, op, b = input().split()\na, b = int(a), int(b)\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    print(a // b)',
        bobotNilai: 100,
      },
    });

    // Test case untuk Kalkulator
    const testCasesKalkulator = [
      { input: "10 + 5", output: "15" },
      { input: "10 - 3", output: "7" },
      { input: "4 * 6", output: "24" },
      { input: "20 / 4", output: "5" },
    ];

    for (const testCase of testCasesKalkulator) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }
  }

  // ===== SOAL PEMROGRAMAN B =====
  // Tugas 1: Looping dan Perulangan
  const progBTugas1 = tugasList.find(
    t =>
      t.praktikum.kodePraktikum === "PROG-B-2025-1" &&
      t.judul.includes("Looping"),
  );

  if (progBTugas1) {
    // Soal 1: Deret Bilangan
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: "Deret Bilangan",
        deskripsi:
          "Buatlah program yang menampilkan deret bilangan dari 1 hingga N.",
        batasan: "N adalah bilangan bulat positif <= 100",
        formatInput: "Sebuah bilangan bulat N",
        formatOutput: "Deret bilangan dari 1 hingga N, dipisahkan spasi",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          'n = int(input())\nfor i in range(1, n+1):\n    print(i, end=" ")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Deret Bilangan
    const testCasesDeret = [
      { input: "5", output: "1 2 3 4 5 " },
      { input: "3", output: "1 2 3 " },
      { input: "1", output: "1 " },
      { input: "10", output: "1 2 3 4 5 6 7 8 9 10 " },
    ];

    for (const testCase of testCasesDeret) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 2: Faktorial
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: "Faktorial",
        deskripsi: "Buatlah program yang menghitung faktorial dari bilangan N.",
        batasan: "N adalah bilangan bulat positif <= 20",
        formatInput: "Sebuah bilangan bulat N",
        formatOutput: "Faktorial dari N",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          "n = int(input())\nfaktorial = 1\nfor i in range(1, n+1):\n    faktorial *= i\nprint(faktorial)",
        bobotNilai: 100,
      },
    });

    // Test case untuk Faktorial
    const testCasesFaktorial = [
      { input: "5", output: "120" },
      { input: "3", output: "6" },
      { input: "1", output: "1" },
      { input: "4", output: "24" },
    ];

    for (const testCase of testCasesFaktorial) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 3: Pola Bintang
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: "Pola Bintang",
        deskripsi:
          "Buatlah program yang menampilkan pola bintang segitiga dengan tinggi N.",
        batasan: "N adalah bilangan bulat positif <= 20",
        formatInput: "Sebuah bilangan bulat N",
        formatOutput: "Pola bintang segitiga dengan tinggi N",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          'n = int(input())\nfor i in range(1, n+1):\n    print("*" * i)',
        bobotNilai: 100,
      },
    });

    // Test case untuk Pola Bintang
    const testCasesPola = [
      {
        input: "3",
        output: "*\n**\n***",
      },
      {
        input: "4",
        output: "*\n**\n***\n****",
      },
    ];

    for (const testCase of testCasesPola) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 4: Jumlah Bilangan Genap
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: "Jumlah Bilangan Genap",
        deskripsi:
          "Buatlah program yang menghitung jumlah bilangan genap dari 1 hingga N.",
        batasan: "N adalah bilangan bulat positif <= 100",
        formatInput: "Sebuah bilangan bulat N",
        formatOutput: "Jumlah bilangan genap dari 1 hingga N",
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode:
          "n = int(input())\njumlah = 0\nfor i in range(2, n+1, 2):\n    jumlah += i\nprint(jumlah)",
        bobotNilai: 100,
      },
    });

    // Test case untuk Jumlah Bilangan Genap
    const testCasesJumlahGenap = [
      { input: "10", output: "30" }, // 2+4+6+8+10 = 30
      { input: "8", output: "20" }, // 2+4+6+8 = 20
      { input: "5", output: "6" }, // 2+4 = 6
    ];

    for (const testCase of testCasesJumlahGenap) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }
  }

  // ===== SOAL STRUKTUR DATA A =====
  // Tugas 1: Stack dan Queue
  const sdaTugas1 = tugasList.find(
    t =>
      t.praktikum.kodePraktikum === "SDA-A-2025-1" && t.judul.includes("Stack"),
  );

  if (sdaTugas1) {
    // Soal 1: Implementasi Stack
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: "Implementasi Stack",
        deskripsi:
          "Implementasikan stack dengan operasi push, pop, dan peek. Program akan menerima serangkaian operasi dan menampilkan hasil setiap operasi.",
        batasan: "Maksimal 100 operasi",
        formatInput:
          "Baris pertama berisi jumlah operasi N. N baris berikutnya berisi operasi: PUSH x, POP, atau PEEK.",
        formatOutput:
          'Untuk setiap operasi POP dan PEEK, tampilkan hasilnya. Jika stack kosong, tampilkan "EMPTY".',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode:
          'stack = []\nn = int(input())\nfor _ in range(n):\n    operation = input().split()\n    if operation[0] == "PUSH":\n        stack.append(int(operation[1]))\n    elif operation[0] == "POP":\n        if stack:\n            print(stack.pop())\n        else:\n            print("EMPTY")\n    elif operation[0] == "PEEK":\n        if stack:\n            print(stack[-1])\n        else:\n            print("EMPTY")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Stack
    const testCasesStack = [
      {
        input: "5\nPUSH 10\nPUSH 20\nPEEK\nPOP\nPOP",
        output: "20\n20\n10",
      },
      {
        input: "3\nPOP\nPUSH 5\nPEEK",
        output: "EMPTY\n5",
      },
    ];

    for (const testCase of testCasesStack) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 2: Kurung Seimbang
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: "Kurung Seimbang",
        deskripsi:
          "Buatlah program yang mengecek apakah kurung dalam string seimbang menggunakan stack.",
        batasan:
          "Panjang string <= 1000, hanya berisi karakter (, ), [, ], {, }",
        formatInput: "Sebuah string berisi karakter kurung",
        formatOutput:
          "SEIMBANG jika kurung seimbang, TIDAK SEIMBANG jika tidak",
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode:
          'def is_balanced(s):\n    stack = []\n    pairs = {"(": ")", "[": "]", "{": "}"}\n    for char in s:\n        if char in pairs:\n            stack.append(char)\n        elif char in pairs.values():\n            if not stack:\n                return False\n            if pairs[stack.pop()] != char:\n                return False\n    return len(stack) == 0\n\ns = input().strip()\nif is_balanced(s):\n    print("SEIMBANG")\nelse:\n    print("TIDAK SEIMBANG")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Kurung Seimbang
    const testCasesKurung = [
      { input: "()", output: "SEIMBANG" },
      { input: "([{}])", output: "SEIMBANG" },
      { input: "([)]", output: "TIDAK SEIMBANG" },
      { input: "((", output: "TIDAK SEIMBANG" },
    ];

    for (const testCase of testCasesKurung) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 3: Implementasi Queue
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: "Implementasi Queue",
        deskripsi:
          "Implementasikan queue dengan operasi enqueue, dequeue, dan front.",
        batasan: "Maksimal 100 operasi",
        formatInput:
          "Baris pertama berisi jumlah operasi N. N baris berikutnya berisi operasi: ENQUEUE x, DEQUEUE, atau FRONT.",
        formatOutput:
          'Untuk setiap operasi DEQUEUE dan FRONT, tampilkan hasilnya. Jika queue kosong, tampilkan "EMPTY".',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode:
          'from collections import deque\nqueue = deque()\nn = int(input())\nfor _ in range(n):\n    operation = input().split()\n    if operation[0] == "ENQUEUE":\n        queue.append(int(operation[1]))\n    elif operation[0] == "DEQUEUE":\n        if queue:\n            print(queue.popleft())\n        else:\n            print("EMPTY")\n    elif operation[0] == "FRONT":\n        if queue:\n            print(queue[0])\n        else:\n            print("EMPTY")',
        bobotNilai: 100,
      },
    });

    // Test case untuk Queue
    const testCasesQueue = [
      {
        input: "5\nENQUEUE 10\nENQUEUE 20\nFRONT\nDEQUEUE\nDEQUEUE",
        output: "10\n10\n20",
      },
      {
        input: "3\nDEQUEUE\nENQUUE 5\nFRONT",
        output: "EMPTY\n5",
      },
    ];

    for (const testCase of testCasesQueue) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }
  }

  // Tugas 2: Sorting Algorithm
  const sdaTugas2 = tugasList.find(
    t =>
      t.praktikum.kodePraktikum === "SDA-A-2025-1" &&
      t.judul.includes("Sorting"),
  );

  if (sdaTugas2) {
    // Soal 1: Bubble Sort
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: "Bubble Sort",
        deskripsi:
          "Implementasikan algoritma bubble sort untuk mengurutkan array.",
        batasan: "Jumlah elemen <= 100, nilai elemen <= 1000",
        formatInput:
          "Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.",
        formatOutput: "Array setelah diurutkan, dipisahkan spasi",
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode:
          'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = bubble_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 100,
      },
    });

    // Test case untuk Bubble Sort
    const testCasesBubble = [
      { input: "5\n64 34 25 12 22", output: "12 22 25 34 64" },
      { input: "3\n3 1 2", output: "1 2 3" },
      { input: "4\n1 1 1 1", output: "1 1 1 1" },
    ];

    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 2: Selection Sort
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: "Selection Sort",
        deskripsi:
          "Implementasikan algoritma selection sort untuk mengurutkan array.",
        batasan: "Jumlah elemen <= 100, nilai elemen <= 1000",
        formatInput:
          "Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.",
        formatOutput: "Array setelah diurutkan, dipisahkan spasi",
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode:
          'def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i+1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = selection_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 100,
      },
    });

    // Test case untuk Selection Sort (sama dengan bubble sort)
    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }

    // Soal 3: Insertion Sort
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: "Insertion Sort",
        deskripsi:
          "Implementasikan algoritma insertion sort untuk mengurutkan array.",
        batasan: "Jumlah elemen <= 100, nilai elemen <= 1000",
        formatInput:
          "Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.",
        formatOutput: "Array setelah diurutkan, dipisahkan spasi",
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode:
          'def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = insertion_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 100,
      },
    });

    // Test case untuk Insertion Sort (sama dengan bubble sort)
    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        },
      });
    }
  }

  // bahasa didukung untuk tugas

  const allTugas = await prisma.tugas.findMany();
  const allBahasa = await prisma.bahasaPemrograman.findMany();

  for (const tugas of allTugas) {
    await prisma.tugasBahasa.createMany({
      data: allBahasa.map(bahasa => ({
        idTugas: tugas.id,
        idBahasa: bahasa.id,
      })),
      skipDuplicates: true
    });
  }

  console.log("Sample soal dan test case created successfully!");
  console.log(`Total Soal: ${await prisma.soal.count()}`);
  console.log(`Total Test Case: ${await prisma.testCase.count()}`);
  console.log(`Total Contoh Test Case: ${await prisma.contohTestCase.count()}`);

  console.log("Seed completed successfully!");
  console.log("\n Summary:");
  console.log(` Fakultas: ${fakultasData.length}`);
  console.log(` Program Studi: ${programStudiData.length}`);
  console.log(` Admin: 1`);
  console.log(` Laboran: 1`);
  console.log(` Dosen: ${dosenData.length}`);
  console.log(` Mahasiswa: ${mahasiswaData.length}`);
  console.log(` Praktikum: ${praktikumData.length}`);
  console.log(` Asisten: ${asistenAssignments.length}`);
  console.log(` Bahasa: ${languages.length}`);
  console.log(` Tugas: ${tugasData.length}`);
  console.log(` Soal: ${await prisma.soal.count()}`);
  console.log(` Test Case: ${await prisma.testCase.count()}`);
  console.log("\n Default Passwords:");
  console.log(`Admin: admin123`);
  console.log(`Laboran: laboran123`);
  console.log(`Dosen: dosen123`);
  console.log(`Mahasiswa: mahasiswa123`);
}


clearDatabase().then(async () => {
  await main();
  })
  .then(async () => {
  await prisma.$disconnect();
  })
  .catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
  });
