# SEKA Platform - Sistem E-Learning Kampus

**SEKA Platform** adalah Learning Management System (LMS) modern untuk mengelola praktikum dan tugas programming secara online. Dibangun dengan Next.js 15, Prisma ORM, dan MySQL.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.10.1-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

---

## Fitur Utama

### Multi-Role System
- **Admin**: Kelola semester, mata kuliah, dan user
- **Dosen**: Buat dan kelola praktikum & tugas
- **Laboran**: Manage asisten dan monitoring praktikum
- **Asisten**: Review submission mahasiswa
- **Mahasiswa**: Submit tugas dan lihat nilai

### Online Judge System
- Submit code dengan multiple bahasa pemrograman (Python, Java, C++, JavaScript, dll)
- Automated testing dengan test cases
- Real-time judging dan feedback
- Submission history tracking

### Dashboard 
- Leaderboard per praktikum/soal
- Progress tracking mahasiswa
- Rekap nilai otomatis

### Authentication & Authorization
- Secure authentication dengan NextAuth.js v5
- Role-based access control (RBAC)
- Protected routes per role

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Database** | MySQL with Prisma ORM |
| **Styling** | TailwindCSS 4, shadcn/ui |
| **Auth** | NextAuth.js v5 |
| **State Management** | Zustand, TanStack Query |
| **Forms** | React Hook Form, Zod |
| **Code Editor** | React Ace Editor |
| **Markdown** | React Markdown, Rehype |

---

## Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** 18.x atau lebih baru
- **pnpm** 8.x atau lebih baru (atau npm/yarn)
- **MySQL** 8.0 atau lebih baru
- **Git**

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Papazy/seka-platform.git
cd seka-platform
```

### 2. Install Dependencies

```bash
pnpm install
# atau
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan konfigurasi Anda:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/seka_platform"

# NextAuth
AUTH_SECRET="your-super-secret-key-min-32-characters"
AUTH_URL="http://localhost:3000"

# Optional: External Judge API
JUDGE_API_URL="http://your-judge-api.com"
JUDGE_API_KEY="your-judge-api-key"
```

### 4. Setup Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (optional)
pnpm db:seed
```

### 5. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## Project Structure

```
seka-platform/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (main)/              # Public pages
│   ├── admin/               # Admin dashboard
│   ├── dosen/               # Dosen dashboard
│   ├── laboran/             # Laboran dashboard
│   ├── mahasiswa/           # Mahasiswa dashboard
│   └── api/                 # API routes
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Form components
│   └── modals/              # Modal components
├── contexts/                # React contexts
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & helpers
├── prisma/                  # Prisma schema & migrations
├── services/                # API services
├── types/                   # TypeScript types
└── utils/                   # Utility functions
```

---

## Available Scripts

| Script | Deskripsi |
|--------|-----------|
| `pnpm dev` | Run development server |
| `pnpm build` | Build production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code dengan Prettier |
| `pnpm type-check` | Check TypeScript types |
| `pnpm db:seed` | Seed database |
| `pnpm prisma studio` | Open Prisma Studio |

---

## Default Credentials (After Seeding)

**Admin**
- Email: `admin@seka.ac.id`
- Password: `admin123`

**Dosen**
- Email: `dosen@seka.ac.id`
- Password: `dosen123`

**Mahasiswa**
- Email: `mahasiswa@seka.ac.id`
- Password: `mahasiswa123`

> **Penting**: Ganti password default setelah login pertama kali!

---

## Deployment

### Deploy to Vercel (Recommended)

Lihat panduan lengkap di [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Papazy/seka-platform)

### Manual Deployment

1. Build project:
```bash
pnpm build
```

2. Set environment variables di hosting Anda

3. Run production server:
```bash
pnpm start
```

---

## Database Schema

Lihat schema lengkap di `prisma/schema.prisma` atau:

```bash
pnpm prisma studio
```

### Main Models
- **User** - User accounts dengan multi-role
- **Semester** - Semester akademik
- **MataKuliah** - Mata kuliah
- **Praktikum** - Praktikum per semester
- **Soal** - Soal/tugas praktikum
- **Submission** - Submit code mahasiswa
- **Nilai** - Nilai mahasiswa

---

## Contributing

Contributions are welcome! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- Gunakan TypeScript untuk type safety
- Follow ESLint & Prettier rules
- Write meaningful commit messages
- Test code sebelum push

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Fajry Ariansyah**

- GitHub: [@Papazy](https://github.com/Papazy)
- Project: [SEKA Platform](https://github.com/Papazy/seka-platform)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📞 Support

Jika ada pertanyaan atau issue:

- Email: fajryjobs@gmail.com
- Issues: [GitHub Issues](https://github.com/Papazy/seka-platform/issues)
- Discussions: [GitHub Discussions](https://github.com/Papazy/seka-platform/discussions)

---

<div align="center">


Made by [Fajry Ariansyah](https://github.com/Papazy)

</div>
