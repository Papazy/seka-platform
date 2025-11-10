# 📦 Panduan Deployment SEKA Platform ke Vercel

> **Panduan lengkap dari basic deployment sampai CI/CD untuk pemula**

## 📋 Daftar Isi

1. [Persiapan Sebelum Deploy](#persiapan-sebelum-deploy)
2. [Deploy Manual (Basic)](#deploy-manual-basic)
3. [Setup Database Production](#setup-database-production)
4. [Setup Environment Variables](#setup-environment-variables)
5. [CI/CD dengan GitHub (Advanced)](#cicd-dengan-github-advanced)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
7. [Best Practices](#best-practices)

---

## 🎯 Persiapan Sebelum Deploy

### 1. Checklist Pre-Deployment

- [ ] **Project sudah berjalan dengan baik di local**
- [ ] **Semua dependencies ter-install dengan benar**
- [ ] **Database schema sudah final**
- [ ] **Environment variables sudah dicatat**
- [ ] **Git repository sudah di-push ke GitHub**

### 2. Akun yang Diperlukan

1. **Akun Vercel** (gratis)
   - Daftar di: https://vercel.com/signup
   - Bisa login dengan GitHub (recommended)

2. **Akun GitHub** (sudah ada)
   - Repository project harus sudah di-push

3. **Database MySQL** (pilih salah satu):
   - **PlanetScale** (recommended, gratis): https://planetscale.com
   - **Railway**: https://railway.app
   - **Aiven**: https://aiven.io
   - **Amazon RDS** (berbayar)

### 3. File yang Perlu Disiapkan

Pastikan file-file ini ada di root project:

```
seka-platform/
├── .gitignore          ✅ (jangan commit .env)
├── package.json        ✅
├── next.config.ts      ✅
├── prisma/
│   └── schema.prisma   ✅
└── vercel.json         ⬅️ (akan kita buat)
```

---

## 🚀 Deploy Manual (Basic)

### Langkah 1: Persiapan Project

1. **Pastikan project di-commit ke Git**

```bash
# Cek status git
git status

# Add semua perubahan (jika ada)
git add .

# Commit
git commit -m "Prepare for deployment"

# Push ke GitHub
git push origin main
```

2. **Buat file `.gitignore` (jika belum ada)**

```bash
# Di root project, pastikan ini ada di .gitignore
echo "
# Environment variables
.env
.env*.local

# Build
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
" >> .gitignore
```

### Langkah 2: Buat Konfigurasi Vercel

Buat file `vercel.json` di root project:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  }
}
```

**Penjelasan:**
- `buildCommand`: Command untuk build project (generate Prisma client dulu, baru build Next.js)
- `installCommand`: Pakai pnpm (sesuai project kamu)
- `regions`: `sin1` = Singapore (paling dekat dari Indonesia)
- `env`: Environment variables yang akan kita set nanti

### Langkah 3: Deploy ke Vercel

#### Opsi A: Via Dashboard Vercel (Paling Mudah)

1. **Buka Vercel Dashboard**
   - Login ke https://vercel.com
   - Klik tombol **"Add New Project"**

2. **Import Git Repository**
   - Pilih **"Import Git Repository"**
   - Pilih repository `seka-platform`
   - Klik **"Import"**

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build
   Install Command: pnpm install
   Output Directory: .next
   ```

4. **Jangan Deploy Dulu!**
   - Klik **"Environment Variables"** dulu
   - Kita akan setup database dan env vars terlebih dahulu

#### Opsi B: Via Vercel CLI (Lebih Kontrol)

1. **Install Vercel CLI**

```bash
pnpm add -g vercel
# atau
npm install -g vercel
```

2. **Login ke Vercel**

```bash
vercel login
```

3. **Deploy (nanti, setelah setup database)**

```bash
vercel
```

---

## 🗄️ Setup Database Production

### Opsi Recommended: PlanetScale (Gratis & Mudah)

#### 1. Daftar PlanetScale

1. Buka: https://planetscale.com
2. Sign up (bisa pakai GitHub)
3. Create New Database:
   - Name: `seka-platform` atau `seka-production`
   - Region: **AWS ap-southeast-1 (Singapore)**
   - Click "Create database"

#### 2. Get Connection String

1. Di dashboard PlanetScale, klik database kamu
2. Klik **"Connect"**
3. Select: **"Prisma"**
4. Copy connection string yang muncul

```
DATABASE_URL="mysql://xxxxxx:pscale_pw_xxxxxx@aws.connect.psdb.cloud/seka-platform?sslaccept=strict"
```

⚠️ **PENTING:** Simpan connection string ini, nanti akan dipakai di Vercel!

#### 3. Setup Database Schema

1. **Update `prisma/schema.prisma`**

Tambahkan di bagian `datasource db`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // ⬅️ TAMBAHKAN INI untuk PlanetScale
}
```

2. **Push Schema ke Production Database**

```bash
# Set DATABASE_URL ke production (sementara)
export DATABASE_URL="mysql://xxxxxx:pscale_pw_xxxxxx@aws.connect.psdb.cloud/seka-platform?sslaccept=strict"

# Push schema
pnpm prisma db push

# Generate Prisma Client
pnpm prisma generate

# (Optional) Seed data
pnpm db:seed
```

### Alternatif: Railway

1. Buka: https://railway.app
2. New Project → Provision MySQL
3. Copy `DATABASE_URL` dari Variables tab
4. Jalankan `prisma db push` seperti di atas

---

## ⚙️ Setup Environment Variables

### 1. Generate Secret Keys

```bash
# Generate NEXTAUTH_SECRET (di terminal)
openssl rand -base64 32
```

Simpan hasilnya, contoh:
```
K7x9mP4nQ2vT5wY8zA1bC3dE6fG9hJ0k
```

### 2. Tambahkan Environment Variables di Vercel

#### Via Dashboard:

1. Buka project di Vercel Dashboard
2. Settings → Environment Variables
3. Tambahkan satu per satu:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `mysql://xxxxxx:pscale_pw_xxxxxx@aws.connect...` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `K7x9mP4nQ2vT5wY8zA1bC3dE6fG9hJ0k` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://seka-platform.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://seka-platform-*.vercel.app` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |

#### Via CLI:

```bash
# Add environment variables
vercel env add DATABASE_URL production
# Paste value saat diminta

vercel env add NEXTAUTH_SECRET production
# Paste value saat diminta

vercel env add NEXTAUTH_URL production
# Paste value saat diminta
```

### 3. Environment Variables Lengkap

Buat file `.env.example` untuk dokumentasi (jangan commit `.env` asli!):

```bash
# .env.example (di-commit ke Git)
DATABASE_URL="mysql://user:password@host:3306/database"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional: Judger Service
JUDGER_API_URL="https://your-judger-service.com"
```

---

## 🎉 Deploy Pertama Kali!

### Via Dashboard Vercel:

1. Setelah semua env vars sudah di-set
2. Klik **"Deploy"**
3. Tunggu proses build (3-5 menit)
4. Jika sukses, kamu akan dapat URL: `https://seka-platform.vercel.app`

### Via CLI:

```bash
# Deploy
vercel

# Jawab pertanyaan:
# - Set up and deploy? → Yes
# - Which scope? → Pilih akun kamu
# - Link to existing project? → No
# - What's your project's name? → seka-platform
# - In which directory is your code located? → ./
# - Want to override the settings? → No

# Deploy ke production
vercel --prod
```

---

## 🔄 CI/CD dengan GitHub (Advanced)

### Apa itu CI/CD?

**CI/CD** = Continuous Integration / Continuous Deployment

Artinya: Setiap kali kamu `git push`, otomatis:
1. ✅ Code di-test
2. ✅ Di-build
3. ✅ Di-deploy ke Vercel

### Setup Automatic Deployments

#### 1. Connect GitHub ke Vercel

**Kabar baik:** Jika kamu deploy via Vercel Dashboard, ini sudah otomatis aktif! 🎉

Cara kerjanya:
- Push ke branch `main` → Deploy ke **Production**
- Push ke branch lain / PR → Deploy ke **Preview** (staging)

#### 2. Workflow yang Terjadi

```
┌─────────────┐
│  Git Push   │
│   to main   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Vercel Detects     │
│  New Commit         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Install Deps       │
│  (pnpm install)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Generate Prisma    │
│  (prisma generate)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Build Next.js      │
│  (next build)       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Deploy to CDN      │
│  ✅ LIVE!           │
└─────────────────────┘
```

#### 3. Setup GitHub Actions (Optional - untuk Testing)

Buat file `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Generate Prisma Client
        run: pnpm prisma generate

      - name: Run linter
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: http://localhost:3000

  # Optional: Deploy after test passes
  # (Vercel already handles this automatically)
```

**Cara Setup:**
1. Buat folder `.github/workflows/`
2. Simpan file di atas sebagai `ci.yml`
3. Add secrets di GitHub: Settings → Secrets → Actions

#### 4. Branch Strategy (Best Practice)

```
main (production)
├── develop (staging/preview)
    ├── feature/new-feature
    └── fix/bug-fix
```

**Workflow:**
1. Buat branch baru untuk feature: `git checkout -b feature/tambah-soal`
2. Develop & test di local
3. Push ke GitHub: `git push origin feature/tambah-soal`
4. Buat Pull Request ke `develop` → Vercel auto-deploy **Preview**
5. Review & test di Preview URL
6. Merge ke `develop` → Deploy ke **Staging**
7. Jika sudah OK, merge `develop` ke `main` → Deploy ke **Production**

---

## 📊 Monitoring & Troubleshooting

### 1. Cek Deployment Status

#### Via Dashboard:
- Buka: https://vercel.com/dashboard
- Klik project kamu
- Tab **"Deployments"** → lihat history

#### Via CLI:
```bash
# List deployments
vercel ls

# Check logs
vercel logs [deployment-url]
```

### 2. Common Issues & Solutions

#### ❌ Issue: Build Failed - Prisma Generate Error

**Error:**
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
# Pastikan di package.json ada:
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

#### ❌ Issue: Database Connection Failed

**Error:**
```
Can't reach database server at `xxxxx`
```

**Solution:**
1. Cek `DATABASE_URL` di Vercel env vars
2. Pastikan database tidak sleep (PlanetScale free tier bisa sleep)
3. Test connection:
```bash
pnpm prisma db pull
```

#### ❌ Issue: Authentication Not Working

**Error:**
```
[auth][error] JWTSessionError
```

**Solution:**
- Cek `NEXTAUTH_SECRET` sudah di-set
- Pastikan `NEXTAUTH_URL` sesuai dengan domain production

#### ❌ Issue: Functions Timeout (Serverless)

**Error:**
```
Task timed out after 10.00 seconds
```

**Solution:**
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30  // Hobby plan: max 10s, Pro: max 60s
    }
  }
}
```

### 3. View Logs Real-time

```bash
# Stream logs
vercel logs --follow

# Filter by function
vercel logs --follow app/api/mahasiswa
```

---

## 🏆 Best Practices

### 1. Environment Management

```bash
# Development (local)
.env.local

# Production (Vercel)
Set via Vercel Dashboard

# Preview/Staging
Set via Vercel Dashboard (preview environment)
```

### 2. Database Migration Strategy

**Untuk Production:**

```bash
# 1. JANGAN pakai prisma migrate dev (ini untuk development)

# 2. Gunakan prisma db push untuk schema changes
pnpm prisma db push

# ATAU (lebih safe):

# 3. Gunakan prisma migrate deploy untuk production
pnpm prisma migrate deploy
```

**Setup di Vercel:**

Tambahkan script di `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

Lalu di `vercel.json`:

```json
{
  "buildCommand": "pnpm vercel-build"
}
```

### 3. Performance Optimization

#### A. Enable Edge Runtime (untuk route yang cepat)

```typescript
// app/api/health/route.ts
export const runtime = 'edge';

export async function GET() {
  return Response.json({ status: 'ok' });
}
```

#### B. Database Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### C. Image Optimization

```typescript
// next.config.ts
const config = {
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 4. Security Checklist

- [ ] Semua secrets di Vercel Environment Variables
- [ ] `.env` di-gitignore
- [ ] CORS di-set dengan benar
- [ ] Rate limiting untuk API routes
- [ ] Input validation di semua endpoints
- [ ] SQL injection protection (Prisma handles this)

### 5. Monitoring & Analytics

**Setup Vercel Analytics:**

```bash
pnpm add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 📝 Quick Reference Commands

```bash
# Deploy
vercel                  # Deploy to preview
vercel --prod          # Deploy to production

# Environment Variables
vercel env ls          # List all env vars
vercel env add         # Add new env var
vercel env rm          # Remove env var

# Logs
vercel logs            # View logs
vercel logs --follow   # Stream logs

# Domains
vercel domains         # List domains
vercel domains add     # Add custom domain

# Projects
vercel ls              # List all projects
vercel inspect         # Show project details

# Database
pnpm prisma studio     # Open Prisma Studio
pnpm prisma db push    # Push schema to DB
pnpm prisma generate   # Generate Prisma Client
```

---

## 🎓 Langkah-Langkah Deployment (Ringkasan)

### First Time Deployment:

```bash
# 1. Setup database (PlanetScale)
# - Create database di dashboard
# - Copy DATABASE_URL

# 2. Push schema ke production DB
export DATABASE_URL="your-production-db-url"
pnpm prisma db push
pnpm prisma generate

# 3. Commit & push to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main

# 4. Deploy to Vercel
vercel

# 5. Set environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# 6. Deploy to production
vercel --prod
```

### Subsequent Deployments (After CI/CD Setup):

```bash
# Just push to GitHub - Vercel handles the rest!
git add .
git commit -m "Add new feature"
git push origin main

# Done! ✅
```

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **PlanetScale Docs**: https://planetscale.com/docs

---

## ✅ Deployment Checklist

Sebelum deploy:
- [ ] Code berjalan di local tanpa error
- [ ] All tests passing (jika ada)
- [ ] Environment variables sudah dicatat
- [ ] Database production sudah ready
- [ ] `.gitignore` sudah benar
- [ ] `vercel.json` sudah dibuat
- [ ] Schema sudah di-push ke production DB

Setelah deploy:
- [ ] Website bisa diakses
- [ ] Login/authentication works
- [ ] Database connection works
- [ ] API routes responding
- [ ] Check Vercel logs for errors

---

**Good luck dengan deployment! 🚀**

Kalau ada error atau butuh bantuan, tanya aja!
