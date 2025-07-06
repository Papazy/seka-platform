// prisma/seed.ts
import { PrismaClient } from '../app/generated/prisma/index.js'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

const Semester = {
  GANJIL: 'GANJIL',
  GENAP: 'GENAP',
}


async function main() {
  console.log('🌱 Starting seed...')

  // Helper function untuk hash password
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
  }

  // 1. ✅ Pengaturan Sistem
  console.log('📊 Seeding system settings...')
  await prisma.pengaturanSistem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      currentSemester: Semester.GANJIL,
      currentYear: 2025,
    },
  })

  // 2. ✅ Bahasa Pemrograman
  console.log('💻 Seeding programming languages...')
  const languages = [
    { nama: 'Python', ekstensi: '.py', compiler: 'python3', versi: '3.11' },
    { nama: 'Java', ekstensi: '.java', compiler: 'javac', versi: '17' },
    { nama: 'C++', ekstensi: '.cpp', compiler: 'g++', versi: '6.3.0' },
    { nama: 'C', ekstensi: '.c', compiler: 'gcc', versi: '6.3.0' },
  ]

  for (const lang of languages) {
    await prisma.bahasaPemrograman.upsert({
      where: { nama: lang.nama },
      update: {},
      create: lang,
    })
  }

  // 3. ✅ Admin
  console.log('👑 Seeding admin...')
  await prisma.admin.upsert({
    where: { email: 'admin@usk.ac.id' },
    update: {},
    create: {
      nama: 'Dr. Budi Santoso',
      email: 'admin@usk.ac.id',
      password: await hashPassword('admin123'),
    },
  })

  // 4. ✅ Laboran
  console.log('🔬 Seeding laboran...')
  const admin = await prisma.admin.findUnique({ where: { email: 'admin@usk.ac.id' } })
  
  await prisma.laboran.upsert({
    where: { email: 'laboran@usk.ac.id' },
    update: {},
    create: {
      idAdmin: admin!.id,
      nama: 'Ahmad Wijaya, S.Kom',
      email: 'laboran@usk.ac.id',
      password: await hashPassword('laboran123'),
    },
  })

  // 5. ✅ Dosen
  console.log('👨‍🏫 Seeding dosen...')
  const dosenData = [
    { nip: '198801012015041001', nama: 'Prof. Dr. Ir. Siti Nurhaliza, M.Kom', email: 'siti.nurhaliza@usk.ac.id' },
    { nip: '198905152016051002', nama: 'Dr. Eng. Andi Pratama, S.T., M.T.', email: 'andi.pratama@usk.ac.id' },
    { nip: '199102201017061003', nama: 'Dr. Rini Sari, S.Kom., M.Kom', email: 'rini.sari@usk.ac.id' },
    { nip: '199304251018071004', nama: 'Ir. Bambang Sutrisno, M.Sc', email: 'bambang.sutrisno@usk.ac.id' },
  ]

  for (const dosen of dosenData) {
    await prisma.dosen.upsert({
      where: { email: dosen.email },
      update: {},
      create: {
        ...dosen,
        password: await hashPassword('dosen123'),
      },
    })
  }

  // 6. ✅ Mahasiswa
  console.log('🎓 Seeding mahasiswa...')
  const mahasiswaData = [
    // Mahasiswa yang akan jadi asisten
    { npm: '2108107010001', nama: 'Rizki Pratama', email: 'rizki.pratama@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107010002', nama: 'Sari Dewi', email: 'sari.dewi@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107010003', nama: 'Budi Setiawan', email: 'budi.setiawan@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107010059', nama: 'Fajry Ariansyah', email: 'fajry@mhs.usk.ac.id', programStudi: 'Informatika' },
    
    // Mahasiswa peserta - Pemrograman A
    { npm: '2108107030001', nama: 'Andi Firmansyah', email: 'andi.firmansyah@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030002', nama: 'Diah Permata', email: 'diah.permata@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030003', nama: 'Cahyo Wibowo', email: 'cahyo.wibowo@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030004', nama: 'Indira Sari', email: 'indira.sari@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030005', nama: 'Fajar Nugroho', email: 'fajar.nugroho@mhs.usk.ac.id', programStudi: 'Informatika' },
    
    // Mahasiswa peserta - Pemrograman B
    { npm: '2108107030006', nama: 'Putri Maharani', email: 'putri.maharani@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030007', nama: 'Yoga Pratama', email: 'yoga.pratama@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030008', nama: 'Lestari Dewi', email: 'lestari.dewi@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030009', nama: 'Arif Rahman', email: 'arif.rahman@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107030010', nama: 'Maya Sari', email: 'maya.sari@mhs.usk.ac.id', programStudi: 'Informatika' },
    
    // Mahasiswa peserta - SDA A
    { npm: '2108107020001', nama: 'Dedi Kurniawan', email: 'dedi.kurniawan@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020002', nama: 'Eka Putri', email: 'eka.putri@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020003', nama: 'Fandi Wijaya', email: 'fandi.wijaya@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020004', nama: 'Gita Sari', email: 'gita.sari@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020005', nama: 'Hendra Gunawan', email: 'hendra.gunawan@mhs.usk.ac.id', programStudi: 'Informatika' },
    
    // Mahasiswa peserta - SDA B
    { npm: '2108107020006', nama: 'Ira Wulandari', email: 'ira.wulandari@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020007', nama: 'Joko Santoso', email: 'joko.santoso@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020008', nama: 'Kiki Amelia', email: 'kiki.amelia@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020009', nama: 'Lukman Hakim', email: 'lukman.hakim@mhs.usk.ac.id', programStudi: 'Informatika' },
    { npm: '2108107020010', nama: 'Mila Kurnia', email: 'mila.kurnia@mhs.usk.ac.id', programStudi: 'Informatika' },
  ]

  for (const mahasiswa of mahasiswaData) {
    await prisma.mahasiswa.upsert({
      where: { email: mahasiswa.email },
      update: {},
      create: {
        ...mahasiswa,
        password: await hashPassword('mahasiswa123'),
      },
    })
  }

  // 7. ✅ Praktikum
  console.log('📚 Seeding praktikum...')
  const laboran = await prisma.laboran.findUnique({ where: { email: 'laboran@usk.ac.id' } })
  
  const praktikumData = [
    {
      nama: 'Praktikum Pemrograman A',
      kodePraktikum: 'PROG-A-2025-1',
      kodeMk: 'TIF101',
      kelas: 'A',
      semester: Semester.GANJIL,
      tahun: 2025,
      jadwalHari: 'Senin',
      jadwalJamMasuk: new Date('2025-01-06T08:00:00.000Z'),
      jadwalJamSelesai: new Date('2025-01-06T10:00:00.000Z'),
      ruang: 'Lab Database',
    },
    {
      nama: 'Praktikum Pemrograman B',
      kodePraktikum: 'PROG-B-2025-1',
      kodeMk: 'TIF101',
      kelas: 'B',
      semester: Semester.GANJIL,
      tahun: 2025,
      jadwalHari: 'Selasa',
      jadwalJamMasuk: new Date('2025-01-07T08:00:00.000Z'),
      jadwalJamSelesai: new Date('2025-01-07T10:00:00.000Z'),
      ruang: 'Lab SKJ',
    },
    {
      nama: 'Praktikum Struktur Data dan Algoritma A',
      kodePraktikum: 'SDA-A-2025-1',
      kodeMk: 'TIF201',
      kelas: 'A',
      semester: Semester.GANJIL,
      tahun: 2025,
      jadwalHari: 'Rabu',
      jadwalJamMasuk: new Date('2025-01-08T10:00:00.000Z'),
      jadwalJamSelesai: new Date('2025-01-08T12:00:00.000Z'),
      ruang: 'Lab RPL',
    },
    {
      nama: 'Praktikum Struktur Data dan Algoritma B',
      kodePraktikum: 'SDA-B-2025-1',
      kodeMk: 'TIF201',
      kelas: 'B',
      semester: Semester.GANJIL,
      tahun: 2025,
      jadwalHari: 'Kamis',
      jadwalJamMasuk: new Date('2025-01-09T10:00:00.000Z'),
      jadwalJamSelesai: new Date('2025-01-09T12:00:00.000Z'),
      ruang: 'Lab Geospasial',
    },
  ]

  for (const praktikum of praktikumData) {
    await prisma.praktikum.upsert({
      where: { kodePraktikum: praktikum.kodePraktikum },
      update: {},
      create: {
        ...praktikum,
        idLaboran: laboran!.id,
      },
    })
  }

  // 8. ✅ Assign Dosen ke Praktikum
  console.log('👨‍🏫 Assigning dosen to praktikum...')
  const dosenList = await prisma.dosen.findMany()
  const praktikumList = await prisma.praktikum.findMany()

  const dosenAssignments = [
    { dosenEmail: 'siti.nurhaliza@usk.ac.id', praktikumCode: 'PROG-A-2025-1' },
    { dosenEmail: 'andi.pratama@usk.ac.id', praktikumCode: 'PROG-B-2025-1' },
    { dosenEmail: 'rini.sari@usk.ac.id', praktikumCode: 'SDA-A-2025-1' },
    { dosenEmail: 'bambang.sutrisno@usk.ac.id', praktikumCode: 'SDA-B-2025-1' },
  ]

  for (const assignment of dosenAssignments) {
    const dosen = dosenList.find(d => d.email === assignment.dosenEmail)
    const praktikum = praktikumList.find(p => p.kodePraktikum === assignment.praktikumCode)
    
    if (dosen && praktikum) {
      await prisma.dosenPraktikum.upsert({
        where: { 
          idDosen_idPraktikum: { 
            idDosen: dosen.id, 
            idPraktikum: praktikum.id 
          } 
        },
        update: {},
        create: {
          idDosen: dosen.id,
          idPraktikum: praktikum.id,
        },
      })
    }
  }

  // 9. ✅ Assign Asisten ke Praktikum
  console.log('🎯 Assigning asisten to praktikum...')
  const mahasiswaList = await prisma.mahasiswa.findMany()
  
  const asistenAssignments = [
    { mahasiswaNpm: '2108107010001', praktikumCode: 'PROG-A-2025-1' },
    { mahasiswaNpm: '2108107010059', praktikumCode: 'PROG-B-2025-1' },
    { mahasiswaNpm: '2108107010003', praktikumCode: 'SDA-A-2025-1' },
    { mahasiswaNpm: '2108107010002', praktikumCode: 'SDA-B-2025-1' },
  ]

  for (const assignment of asistenAssignments) {
    const mahasiswa = mahasiswaList.find(m => m.npm === assignment.mahasiswaNpm)
    const praktikum = praktikumList.find(p => p.kodePraktikum === assignment.praktikumCode)
    
    if (mahasiswa && praktikum) {
      await prisma.asistenPraktikum.upsert({
        where: { 
          idMahasiswa_idPraktikum: { 
            idMahasiswa: mahasiswa.id, 
            idPraktikum: praktikum.id 
          } 
        },
        update: {},
        create: {
          idMahasiswa: mahasiswa.id,
          idPraktikum: praktikum.id,
        },
      })
    }
  }

  // 10. ✅ Assign Peserta ke Praktikum
  console.log('🎓 Assigning peserta to praktikum...')
  const pesertaAssignments = [
    // Pemrograman A
    { npmRange: ['2108107030001', '2108107030005'], praktikumCode: 'PROG-A-2025-1' },
    // Pemrograman B
    { npmRange: ['2108107030006', '2108107030010'], praktikumCode: 'PROG-B-2025-1' },
    // SDA A
    { npmRange: ['2108107020001', '2108107020005'], praktikumCode: 'SDA-A-2025-1' },
    // SDA B
    { npmRange: ['2108107020006', '2108107020010'], praktikumCode: 'SDA-B-2025-1' },
  ]

  for (const assignment of pesertaAssignments) {
    const praktikum = praktikumList.find(p => p.kodePraktikum === assignment.praktikumCode)
    
    if (praktikum) {
      const pesertaInRange = mahasiswaList.filter(m => 
        m.npm >= assignment.npmRange[0] && m.npm <= assignment.npmRange[1]
      )
      
      for (const peserta of pesertaInRange) {
        await prisma.pesertaPraktikum.upsert({
          where: { 
            idMahasiswa_idPraktikum: { 
              idMahasiswa: peserta.id, 
              idPraktikum: praktikum.id 
            } 
          },
          update: {},
          create: {
            idMahasiswa: peserta.id,
            idPraktikum: praktikum.id,
          },
        })
      }
    }
  }

  // masukkan npm 2108107010059 mejadi peserta praktikum Struktur Data A
  // masukkan juga ke praktikum Struktur data B
  const sdaAPraktikum = await prisma.praktikum.findUnique({
    where: { kodePraktikum: 'SDA-A-2025-1' }
  })
  const sdaBPraktikum = await prisma.praktikum.findUnique({
    where: { kodePraktikum: 'SDA-B-2025-1' }
  })
  const mahasiswaFajry = await prisma.mahasiswa.findUnique({
    where: { npm: '2108107010059' }
  })

  if (sdaAPraktikum && sdaBPraktikum && mahasiswaFajry) {
    await prisma.pesertaPraktikum.upsert({
      where: { 
        idMahasiswa_idPraktikum: { 
          idMahasiswa: mahasiswaFajry.id, 
          idPraktikum: sdaAPraktikum.id 
        } 
      },
      update: {},
      create: {
        idMahasiswa: mahasiswaFajry.id,
        idPraktikum: sdaAPraktikum.id,
      },
    })

    await prisma.pesertaPraktikum.upsert({
      where: { 
        idMahasiswa_idPraktikum: { 
          idMahasiswa: mahasiswaFajry.id, 
          idPraktikum: sdaBPraktikum.id 
        } 
      },
      update: {},
      create: {
        idMahasiswa: mahasiswaFajry.id,
        idPraktikum: sdaBPraktikum.id,
      },
    })
  }
  

  // 11. ✅ Create Sample Tugas
  console.log('📝 Creating sample tugas...')
  const asistenList = await prisma.asistenPraktikum.findMany({
    include: { praktikum: true }
  })

  const tugasData = [
    // Pemrograman A
    {
      judul: 'Tugas 1: Input Output dan Variabel',
      deskripsi: 'Praktikum pertama tentang input output dasar dan penggunaan variabel dalam pemrograman.',
      praktikumCode: 'PROG-A-2025-1',
      deadline: new Date('2025-01-20T23:59:59.000Z'),
      maksimalSubmit: 3,
    },
    {
      judul: 'Tugas 2: Percabangan dan Kondisi',
      deskripsi: 'Praktikum tentang if-else, switch case, dan penggunaan operator logika.',
      praktikumCode: 'PROG-A-2025-1',
      deadline: new Date('2025-01-27T23:59:59.000Z'),
      maksimalSubmit: 3,
    },
    // Pemrograman B
    {
      judul: 'Tugas 1: Looping dan Perulangan',
      deskripsi: 'Praktikum tentang for loop, while loop, dan do-while loop.',
      praktikumCode: 'PROG-B-2025-1',
      deadline: new Date('2025-01-21T23:59:59.000Z'),
      maksimalSubmit: 3,
    },
    {
      judul: 'Tugas 2: Array dan String',
      deskripsi: 'Praktikum tentang manipulasi array dan string processing.',
      praktikumCode: 'PROG-B-2025-1',
      deadline: new Date('2025-01-28T23:59:59.000Z'),
      maksimalSubmit: 3,
    },
    // SDA A
    {
      judul: 'Tugas 1: Stack dan Queue',
      deskripsi: 'Implementasi struktur data stack dan queue beserta operasi-operasinya.',
      praktikumCode: 'SDA-A-2025-1',
      deadline: new Date('2025-01-22T23:59:59.000Z'),
      maksimalSubmit: 5,
    },
    {
      judul: 'Tugas 2: Sorting Algorithm',
      deskripsi: 'Implementasi algoritma sorting: bubble sort, insertion sort, dan selection sort.',
      praktikumCode: 'SDA-A-2025-1',
      deadline: new Date('2025-01-29T23:59:59.000Z'),
      maksimalSubmit: 5,
    },
    // SDA B
    {
      judul: 'Tugas 1: Linked List',
      deskripsi: 'Implementasi single linked list dan double linked list.',
      praktikumCode: 'SDA-B-2025-1',
      deadline: new Date('2025-01-23T23:59:59.000Z'),
      maksimalSubmit: 5,
    },
    {
      judul: 'Tugas 2: Tree dan Graph',
      deskripsi: 'Implementasi binary tree dan basic graph operations.',
      praktikumCode: 'SDA-B-2025-1',
      deadline: new Date('2025-01-30T23:59:59.000Z'),
      maksimalSubmit: 5,
    },
  ]

  for (const tugas of tugasData) {
    const asisten = asistenList.find(a => a.praktikum.kodePraktikum === tugas.praktikumCode)
    
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
      })
    }
  }

  // 12. ✅ Create Sample Soal dan Test Case
  console.log('🧩 Creating sample soal dan test case...')
  
  let tugasList = await prisma.tugas.findMany({
    include: { praktikum: true }
  })

  // Helper untuk mendapatkan bahasa Python
  const pythonLang = await prisma.bahasaPemrograman.findUnique({
    where: { nama: 'Python' }
  })

  // ===== SOAL PEMROGRAMAN A =====
  // Tugas 1: Input Output dan Variabel
  const progATugas1 = tugasList.find(t => 
    t.praktikum.kodePraktikum === 'PROG-A-2025-1' && 
    t.judul.includes('Input Output')
  )

  if (progATugas1) {
    // Soal 1: Hello World
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: 'Hello World',
        deskripsi: 'Buatlah program yang menampilkan "Hello World!" ke layar.',
        batasan: 'Tidak ada batasan khusus',
        formatInput: 'Tidak ada input',
        formatOutput: 'Hello World!',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'print("Hello World!")',
        bobotNilai: 25,
      }
    })

    // Test case untuk Hello World
    await prisma.testCase.create({
      data: {
        idSoal: soal1.id,
        input: '',
        outputDiharapkan: 'Hello World!',
      }
    })

    // Contoh test case untuk Hello World
    await prisma.contohTestCase.create({
      data: {
        idSoal: soal1.id,
        contohInput: '',
        contohOutput: 'Hello World!',
        penjelasanInput: 'Tidak ada input yang diperlukan',
        penjelasanOutput: 'Program harus menampilkan teks "Hello World!" persis seperti ini',
      }
    })

    // Soal 2: Penjumlahan Sederhana
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: 'Penjumlahan Sederhana',
        deskripsi: 'Buatlah program yang membaca dua bilangan bulat dan menampilkan hasil penjumlahannya.',
        batasan: 'Bilangan bulat dalam rentang -1000 hingga 1000',
        formatInput: 'Dua bilangan bulat A dan B dalam satu baris, dipisahkan spasi',
        formatOutput: 'Hasil penjumlahan A + B',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'A, B = map(int, input().split())\nprint(A + B)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Penjumlahan
    const testCasesPenjumlahan = [
      { input: '5 3', output: '8' },
      { input: '10 -2', output: '8' },
      { input: '0 0', output: '0' },
      { input: '-5 -3', output: '-8' },
    ]

    for (const testCase of testCasesPenjumlahan) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Contoh test case untuk Penjumlahan
    await prisma.contohTestCase.create({
      data: {
        idSoal: soal2.id,
        contohInput: '5 3',
        contohOutput: '8',
        penjelasanInput: 'Dua bilangan: 5 dan 3',
        penjelasanOutput: 'Hasil penjumlahan: 5 + 3 = 8',
      }
    })

    // Soal 3: Luas Persegi Panjang
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: 'Luas Persegi Panjang',
        deskripsi: 'Buatlah program yang menghitung luas persegi panjang berdasarkan panjang dan lebar yang diinput.',
        batasan: 'Panjang dan lebar adalah bilangan positif <= 100',
        formatInput: 'Panjang dan lebar dalam satu baris, dipisahkan spasi',
        formatOutput: 'Luas persegi panjang',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'panjang, lebar = map(int, input().split())\nprint(panjang * lebar)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Luas Persegi Panjang
    const testCasesLuas = [
      { input: '5 4', output: '20' },
      { input: '10 3', output: '30' },
      { input: '1 1', output: '1' },
      { input: '7 8', output: '56' },
    ]

    for (const testCase of testCasesLuas) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 4: Gaji Karyawan
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progATugas1.id,
        judul: 'Gaji Karyawan',
        deskripsi: 'Buatlah program yang menghitung gaji karyawan berdasarkan jam kerja dan upah per jam.',
        batasan: 'Jam kerja <= 168 jam per minggu, upah per jam <= 100000',
        formatInput: 'Jam kerja dan upah per jam dalam satu baris, dipisahkan spasi',
        formatOutput: 'Total gaji',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'jam_kerja, upah_per_jam = map(int, input().split())\nprint(jam_kerja * upah_per_jam)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Gaji Karyawan
    const testCasesGaji = [
      { input: '40 50000', output: '2000000' },
      { input: '35 75000', output: '2625000' },
      { input: '20 25000', output: '500000' },
    ]

    for (const testCase of testCasesGaji) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }
  }

  // Tugas 2: Percabangan dan Kondisi
  const progATugas2 = tugasList.find(t => 
    t.praktikum.kodePraktikum === 'PROG-A-2025-1' && 
    t.judul.includes('Percabangan')
  )

  if (progATugas2) {
    // Soal 1: Bilangan Genap Ganjil
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: 'Bilangan Genap atau Ganjil',
        deskripsi: 'Buatlah program yang menentukan apakah sebuah bilangan adalah genap atau ganjil.',
        batasan: 'Bilangan bulat dalam rentang -1000 hingga 1000',
        formatInput: 'Sebuah bilangan bulat',
        formatOutput: 'GENAP jika bilangan genap, GANJIL jika bilangan ganjil',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'n = int(input())\nif n % 2 == 0:\n    print("GENAP")\nelse:\n    print("GANJIL")',
        bobotNilai: 25,
      }
    })

    // Test case untuk Genap Ganjil
    const testCasesGenapGanjil = [
      { input: '4', output: 'GENAP' },
      { input: '7', output: 'GANJIL' },
      { input: '0', output: 'GENAP' },
      { input: '-3', output: 'GANJIL' },
    ]

    for (const testCase of testCasesGenapGanjil) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 2: Nilai Ujian
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: 'Nilai Ujian',
        deskripsi: 'Buatlah program yang menentukan grade berdasarkan nilai ujian (A: 90-100, B: 80-89, C: 70-79, D: 60-69, E: <60).',
        batasan: 'Nilai dalam rentang 0-100',
        formatInput: 'Nilai ujian (bilangan bulat)',
        formatOutput: 'Grade A, B, C, D, atau E',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'nilai = int(input())\nif nilai >= 90:\n    print("A")\nelif nilai >= 80:\n    print("B")\nelif nilai >= 70:\n    print("C")\nelif nilai >= 60:\n    print("D")\nelse:\n    print("E")',
        bobotNilai: 25,
      }
    })

    // Test case untuk Nilai Ujian
    const testCasesNilai = [
      { input: '95', output: 'A' },
      { input: '85', output: 'B' },
      { input: '75', output: 'C' },
      { input: '65', output: 'D' },
      { input: '55', output: 'E' },
    ]

    for (const testCase of testCasesNilai) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 3: Bilangan Terbesar
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: 'Bilangan Terbesar',
        deskripsi: 'Buatlah program yang menentukan bilangan terbesar dari tiga bilangan yang diinput.',
        batasan: 'Bilangan bulat dalam rentang -1000 hingga 1000',
        formatInput: 'Tiga bilangan bulat dalam satu baris, dipisahkan spasi',
        formatOutput: 'Bilangan terbesar',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'a, b, c = map(int, input().split())\nprint(max(a, b, c))',
        bobotNilai: 25,
      }
    })

    // Test case untuk Bilangan Terbesar
    const testCasesTerbesar = [
      { input: '5 3 8', output: '8' },
      { input: '10 15 7', output: '15' },
      { input: '2 2 2', output: '2' },
      { input: '-1 -5 -3', output: '-1' },
    ]

    for (const testCase of testCasesTerbesar) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 4: Kalkulator Sederhana
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progATugas2.id,
        judul: 'Kalkulator Sederhana',
        deskripsi: 'Buatlah program kalkulator sederhana yang dapat melakukan operasi +, -, *, /.',
        batasan: 'Bilangan bulat dalam rentang -1000 hingga 1000, pembagian tidak boleh dengan 0',
        formatInput: 'Bilangan pertama, operator (+, -, *, /), bilangan kedua dalam satu baris dipisahkan spasi',
        formatOutput: 'Hasil operasi (untuk pembagian, tampilkan hasil dalam bentuk bilangan bulat)',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'a, op, b = input().split()\na, b = int(a), int(b)\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    print(a // b)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Kalkulator
    const testCasesKalkulator = [
      { input: '10 + 5', output: '15' },
      { input: '10 - 3', output: '7' },
      { input: '4 * 6', output: '24' },
      { input: '20 / 4', output: '5' },
    ]

    for (const testCase of testCasesKalkulator) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }
  }

  // ===== SOAL PEMROGRAMAN B =====
  // Tugas 1: Looping dan Perulangan
  const progBTugas1 = tugasList.find(t => 
    t.praktikum.kodePraktikum === 'PROG-B-2025-1' && 
    t.judul.includes('Looping')
  )

  if (progBTugas1) {
    // Soal 1: Deret Bilangan
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: 'Deret Bilangan',
        deskripsi: 'Buatlah program yang menampilkan deret bilangan dari 1 hingga N.',
        batasan: 'N adalah bilangan bulat positif <= 100',
        formatInput: 'Sebuah bilangan bulat N',
        formatOutput: 'Deret bilangan dari 1 hingga N, dipisahkan spasi',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'n = int(input())\nfor i in range(1, n+1):\n    print(i, end=" ")',
        bobotNilai: 25,
      }
    })

    // Test case untuk Deret Bilangan
    const testCasesDeret = [
      { input: '5', output: '1 2 3 4 5 ' },
      { input: '3', output: '1 2 3 ' },
      { input: '1', output: '1 ' },
      { input: '10', output: '1 2 3 4 5 6 7 8 9 10 ' },
    ]

    for (const testCase of testCasesDeret) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 2: Faktorial
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: 'Faktorial',
        deskripsi: 'Buatlah program yang menghitung faktorial dari bilangan N.',
        batasan: 'N adalah bilangan bulat positif <= 20',
        formatInput: 'Sebuah bilangan bulat N',
        formatOutput: 'Faktorial dari N',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'n = int(input())\nfaktorial = 1\nfor i in range(1, n+1):\n    faktorial *= i\nprint(faktorial)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Faktorial
    const testCasesFaktorial = [
      { input: '5', output: '120' },
      { input: '3', output: '6' },
      { input: '1', output: '1' },
      { input: '4', output: '24' },
    ]

    for (const testCase of testCasesFaktorial) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 3: Pola Bintang
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: 'Pola Bintang',
        deskripsi: 'Buatlah program yang menampilkan pola bintang segitiga dengan tinggi N.',
        batasan: 'N adalah bilangan bulat positif <= 20',
        formatInput: 'Sebuah bilangan bulat N',
        formatOutput: 'Pola bintang segitiga dengan tinggi N',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'n = int(input())\nfor i in range(1, n+1):\n    print("*" * i)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Pola Bintang
    const testCasesPola = [
      { 
        input: '3', 
        output: '*\n**\n***' 
      },
      { 
        input: '4', 
        output: '*\n**\n***\n****' 
      },
    ]

    for (const testCase of testCasesPola) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 4: Jumlah Bilangan Genap
    const soal4 = await prisma.soal.create({
      data: {
        idTugas: progBTugas1.id,
        judul: 'Jumlah Bilangan Genap',
        deskripsi: 'Buatlah program yang menghitung jumlah bilangan genap dari 1 hingga N.',
        batasan: 'N adalah bilangan bulat positif <= 100',
        formatInput: 'Sebuah bilangan bulat N',
        formatOutput: 'Jumlah bilangan genap dari 1 hingga N',
        batasanMemoriKb: 32768,
        batasanWaktuEksekusiMs: 1000,
        templateKode: 'n = int(input())\njumlah = 0\nfor i in range(2, n+1, 2):\n    jumlah += i\nprint(jumlah)',
        bobotNilai: 25,
      }
    })

    // Test case untuk Jumlah Bilangan Genap
    const testCasesJumlahGenap = [
      { input: '10', output: '30' }, // 2+4+6+8+10 = 30
      { input: '8', output: '20' },  // 2+4+6+8 = 20
      { input: '5', output: '6' },   // 2+4 = 6
    ]

    for (const testCase of testCasesJumlahGenap) {
      await prisma.testCase.create({
        data: {
          idSoal: soal4.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }
  }

  // ===== SOAL STRUKTUR DATA A =====
  // Tugas 1: Stack dan Queue
  const sdaTugas1 = tugasList.find(t => 
    t.praktikum.kodePraktikum === 'SDA-A-2025-1' && 
    t.judul.includes('Stack')
  )

  if (sdaTugas1) {
    // Soal 1: Implementasi Stack
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: 'Implementasi Stack',
        deskripsi: 'Implementasikan stack dengan operasi push, pop, dan peek. Program akan menerima serangkaian operasi dan menampilkan hasil setiap operasi.',
        batasan: 'Maksimal 100 operasi',
        formatInput: 'Baris pertama berisi jumlah operasi N. N baris berikutnya berisi operasi: PUSH x, POP, atau PEEK.',
        formatOutput: 'Untuk setiap operasi POP dan PEEK, tampilkan hasilnya. Jika stack kosong, tampilkan "EMPTY".',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode: 'stack = []\nn = int(input())\nfor _ in range(n):\n    operation = input().split()\n    if operation[0] == "PUSH":\n        stack.append(int(operation[1]))\n    elif operation[0] == "POP":\n        if stack:\n            print(stack.pop())\n        else:\n            print("EMPTY")\n    elif operation[0] == "PEEK":\n        if stack:\n            print(stack[-1])\n        else:\n            print("EMPTY")',
        bobotNilai: 30,
      }
    })

    // Test case untuk Stack
    const testCasesStack = [
      { 
        input: '5\nPUSH 10\nPUSH 20\nPEEK\nPOP\nPOP', 
        output: '20\n20\n10' 
      },
      { 
        input: '3\nPOP\nPUSH 5\nPEEK', 
        output: 'EMPTY\n5' 
      },
    ]

    for (const testCase of testCasesStack) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 2: Kurung Seimbang
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: 'Kurung Seimbang',
        deskripsi: 'Buatlah program yang mengecek apakah kurung dalam string seimbang menggunakan stack.',
        batasan: 'Panjang string <= 1000, hanya berisi karakter (, ), [, ], {, }',
        formatInput: 'Sebuah string berisi karakter kurung',
        formatOutput: 'SEIMBANG jika kurung seimbang, TIDAK SEIMBANG jika tidak',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode: 'def is_balanced(s):\n    stack = []\n    pairs = {"(": ")", "[": "]", "{": "}"}\n    for char in s:\n        if char in pairs:\n            stack.append(char)\n        elif char in pairs.values():\n            if not stack:\n                return False\n            if pairs[stack.pop()] != char:\n                return False\n    return len(stack) == 0\n\ns = input().strip()\nif is_balanced(s):\n    print("SEIMBANG")\nelse:\n    print("TIDAK SEIMBANG")',
        bobotNilai: 35,
      }
    })

    // Test case untuk Kurung Seimbang
    const testCasesKurung = [
      { input: '()', output: 'SEIMBANG' },
      { input: '([{}])', output: 'SEIMBANG' },
      { input: '([)]', output: 'TIDAK SEIMBANG' },
      { input: '((', output: 'TIDAK SEIMBANG' },
    ]

    for (const testCase of testCasesKurung) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 3: Implementasi Queue
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas1.id,
        judul: 'Implementasi Queue',
        deskripsi: 'Implementasikan queue dengan operasi enqueue, dequeue, dan front.',
        batasan: 'Maksimal 100 operasi',
        formatInput: 'Baris pertama berisi jumlah operasi N. N baris berikutnya berisi operasi: ENQUEUE x, DEQUEUE, atau FRONT.',
        formatOutput: 'Untuk setiap operasi DEQUEUE dan FRONT, tampilkan hasilnya. Jika queue kosong, tampilkan "EMPTY".',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 2000,
        templateKode: 'from collections import deque\nqueue = deque()\nn = int(input())\nfor _ in range(n):\n    operation = input().split()\n    if operation[0] == "ENQUEUE":\n        queue.append(int(operation[1]))\n    elif operation[0] == "DEQUEUE":\n        if queue:\n            print(queue.popleft())\n        else:\n            print("EMPTY")\n    elif operation[0] == "FRONT":\n        if queue:\n            print(queue[0])\n        else:\n            print("EMPTY")',
        bobotNilai: 35,
      }
    })

    // Test case untuk Queue
    const testCasesQueue = [
      { 
        input: '5\nENQUEUE 10\nENQUEUE 20\nFRONT\nDEQUEUE\nDEQUEUE', 
        output: '10\n10\n20' 
      },
      { 
        input: '3\nDEQUEUE\nENQUUE 5\nFRONT', 
        output: 'EMPTY\n5' 
      },
    ]

    for (const testCase of testCasesQueue) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }
  }

  // Tugas 2: Sorting Algorithm
  const sdaTugas2 = tugasList.find(t => 
    t.praktikum.kodePraktikum === 'SDA-A-2025-1' && 
    t.judul.includes('Sorting')
  )

  if (sdaTugas2) {
    // Soal 1: Bubble Sort
    const soal1 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: 'Bubble Sort',
        deskripsi: 'Implementasikan algoritma bubble sort untuk mengurutkan array.',
        batasan: 'Jumlah elemen <= 100, nilai elemen <= 1000',
        formatInput: 'Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.',
        formatOutput: 'Array setelah diurutkan, dipisahkan spasi',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = bubble_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 40,
      }
    })

    // Test case untuk Bubble Sort
    const testCasesBubble = [
      { input: '5\n64 34 25 12 22', output: '12 22 25 34 64' },
      { input: '3\n3 1 2', output: '1 2 3' },
      { input: '4\n1 1 1 1', output: '1 1 1 1' },
    ]

    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal1.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 2: Selection Sort
    const soal2 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: 'Selection Sort',
        deskripsi: 'Implementasikan algoritma selection sort untuk mengurutkan array.',
        batasan: 'Jumlah elemen <= 100, nilai elemen <= 1000',
        formatInput: 'Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.',
        formatOutput: 'Array setelah diurutkan, dipisahkan spasi',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode: 'def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i+1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = selection_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 30,
      }
    })

    // Test case untuk Selection Sort (sama dengan bubble sort)
    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal2.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }

    // Soal 3: Insertion Sort
    const soal3 = await prisma.soal.create({
      data: {
        idTugas: sdaTugas2.id,
        judul: 'Insertion Sort',
        deskripsi: 'Implementasikan algoritma insertion sort untuk mengurutkan array.',
        batasan: 'Jumlah elemen <= 100, nilai elemen <= 1000',
        formatInput: 'Baris pertama berisi jumlah elemen N. Baris kedua berisi N elemen dipisahkan spasi.',
        formatOutput: 'Array setelah diurutkan, dipisahkan spasi',
        batasanMemoriKb: 65536,
        batasanWaktuEksekusiMs: 3000,
        templateKode: 'def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\nn = int(input())\narr = list(map(int, input().split()))\nsorted_arr = insertion_sort(arr)\nprint(" ".join(map(str, sorted_arr)))',
        bobotNilai: 30,
      }
    })

    // Test case untuk Insertion Sort (sama dengan bubble sort)
    for (const testCase of testCasesBubble) {
      await prisma.testCase.create({
        data: {
          idSoal: soal3.id,
          input: testCase.input,
          outputDiharapkan: testCase.output,
        }
      })
    }
  }

  // 12. ✅ Create Sample Soal untuk setiap Tugas
  console.log('🔍 Creating sample soal...')
  tugasList = await prisma.tugas.findMany()

  const soalData = [
    // Tugas 1: Input Output dan Variabel - PROG-A
    {
      tugasJudul: 'Tugas 1: Input Output dan Variabel',
      judul: 'Hello World',
      deskripsi: 'Buatlah program yang menampilkan "Hello World!" ke layar.',
      batasan: 'Tidak ada batasan khusus',
      formatInput: 'Tidak ada input',
      formatOutput: 'Hello World!',
      batasanMemoriKb: 256000,
      batasanWaktuEksekusiMs: 1000,
      templateKode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tulis kode di sini\n    return 0;\n}',
      bobotNilai: 100,
      contohTestCases: [
        {
          contohInput: '',
          contohOutput: 'Hello World!',
          penjelasanInput: 'Tidak ada input yang diperlukan',
          penjelasanOutput: 'Program harus menampilkan "Hello World!" persis seperti ini'
        }
      ],
      testCases: [
        { input: '', outputDiharapkan: 'Hello World!' }
      ]
    },
    {
      tugasJudul: 'Tugas 1: Input Output dan Variabel',
      judul: 'Penjumlahan Dua Bilangan',
      deskripsi: 'Buatlah program yang membaca dua bilangan bulat dan menampilkan hasil penjumlahannya.',
      batasan: '1 ≤ a, b ≤ 1000',
      formatInput: 'Dua bilangan bulat a dan b dipisahkan spasi',
      formatOutput: 'Hasil penjumlahan a + b',
      batasanMemoriKb: 256000,
      batasanWaktuEksekusiMs: 1000,
      templateKode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Tulis kode di sini\n    return 0;\n}',
      bobotNilai: 100,
      contohTestCases: [
        {
          contohInput: '5 3',
          contohOutput: '8',
          penjelasanInput: 'Dua bilangan: 5 dan 3',
          penjelasanOutput: '5 + 3 = 8'
        }
      ],
      testCases: [
        { input: '5 3', outputDiharapkan: '8' },
        { input: '10 20', outputDiharapkan: '30' },
        { input: '1 1', outputDiharapkan: '2' }
      ]
    },
    // Tugas 1: Stack dan Queue - SDA-A
    {
      tugasJudul: 'Tugas 1: Stack dan Queue',
      judul: 'Implementasi Stack',
      deskripsi: 'Implementasikan struktur data stack dengan operasi push, pop, dan top.',
      batasan: '1 ≤ n ≤ 1000 operasi',
      formatInput: 'Baris pertama berisi n (jumlah operasi)\nn baris berikutnya berisi operasi: PUSH x, POP, atau TOP',
      formatOutput: 'Untuk setiap operasi TOP dan POP, keluarkan nilai yang sesuai',
      batasanMemoriKb: 256000,
      batasanWaktuEksekusiMs: 2000,
      templateKode: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Implementasi stack di sini\n    return 0;\n}',
      bobotNilai: 100,
      contohTestCases: [
        {
          contohInput: '5\nPUSH 1\nPUSH 2\nTOP\nPOP\nTOP',
          contohOutput: '2\n2\n1',
          penjelasanInput: '5 operasi: push 1, push 2, top, pop, top',
          penjelasanOutput: 'TOP menampilkan 2, POP mengeluarkan 2, TOP menampilkan 1'
        }
      ],
      testCases: [
        { 
          input: '5\nPUSH 1\nPUSH 2\nTOP\nPOP\nTOP', 
          outputDiharapkan: '2\n2\n1' 
        },
        { 
          input: '3\nPUSH 10\nPUSH 20\nTOP',
          outputDiharapkan: '20' 
        }
      ]
    }
  ]

  for (const soal of soalData) {
    const tugas = tugasList.find(t => t.judul === soal.tugasJudul)
    
    if (tugas) {
      const createdSoal = await prisma.soal.create({
        data: {
          idTugas: tugas.id,
          judul: soal.judul,
          deskripsi: soal.deskripsi,
          batasan: soal.batasan,
          formatInput: soal.formatInput,
          formatOutput: soal.formatOutput,
          batasanMemoriKb: soal.batasanMemoriKb,
          batasanWaktuEksekusiMs: soal.batasanWaktuEksekusiMs,
          templateKode: soal.templateKode,
          bobotNilai: soal.bobotNilai,
        },
      })

      // Create ContohTestCase
      for (const contoh of soal.contohTestCases) {
        await prisma.contohTestCase.create({
          data: {
            idSoal: createdSoal.id,
            contohInput: contoh.contohInput,
            contohOutput: contoh.contohOutput,
            penjelasanInput: contoh.penjelasanInput,
            penjelasanOutput: contoh.penjelasanOutput,
          },
        })
      }

      // Create TestCase
      for (const testCase of soal.testCases) {
        await prisma.testCase.create({
          data: {
            idSoal: createdSoal.id,
            input: testCase.input,
            outputDiharapkan: testCase.outputDiharapkan,
          },
        })
      }
    }
  }

  console.log('✅ Sample soal dan test case created successfully!')
  console.log(`📝 Total Soal: ${await prisma.soal.count()}`)
  console.log(`🧪 Total Test Case: ${await prisma.testCase.count()}`)
  console.log(`📚 Total Contoh Test Case: ${await prisma.contohTestCase.count()}`)

  // Update summary
  const totalSoal = await prisma.soal.count()
  const totalTestCase = await prisma.testCase.count()
  
  console.log('✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`👑 Admin: 1`)
  console.log(`🔬 Laboran: 1`)
  console.log(`👨‍🏫 Dosen: ${dosenData.length}`)
  console.log(`🎓 Mahasiswa: ${mahasiswaData.length}`)
  console.log(`📚 Praktikum: ${praktikumData.length}`)
  console.log(`🎯 Asisten: ${asistenAssignments.length}`)
  console.log(`💻 Bahasa: ${languages.length}`)
  console.log(`📝 Tugas: ${tugasData.length}`)
  console.log(`🧩 Soal: ${totalSoal}`)
  console.log(`🧪 Test Case: ${totalTestCase}`)
  console.log('\n🔐 Default Passwords:')
  console.log(`Admin: admin123`)
  console.log(`Laboran: laboran123`)
  console.log(`Dosen: dosen123`)
  console.log(`Mahasiswa: mahasiswa123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })