# 🏥 Klinik Pratama Aisyiyah — Website Resmi

Website resmi Klinik Pratama Aisyiyah Pangkajene, dibangun dengan **Next.js 16**, **Prisma ORM**, dan **MySQL**. Menyediakan portal informasi publik dan panel admin untuk pengelolaan konten klinik.

---

## ✨ Fitur Utama

- **Halaman Publik** — Beranda, Artikel Kesehatan, Event & Kegiatan, Kontak
- **Panel Admin** — Kelola Artikel, Event, Banner Hero, Fasilitas, dan Mitra Kerjasama
- **Autentikasi** — Login admin berbasis JWT (cookie HttpOnly)
- **Upload Gambar** — Upload lokal ke `/public/uploads/`
- **SEO Optimized** — Metadata dinamis, sitemap.xml, Open Graph
- **ISR (Incremental Static Regeneration)** — Halaman di-cache dan di-refresh otomatis

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma v5 |
| Database | MySQL |
| Auth | JWT via `jose` |
| Password | `bcryptjs` |

---

## 📋 Prasyarat

Pastikan perangkat Anda telah menginstal:

- **Node.js** versi `18.x` atau lebih baru → [Download](https://nodejs.org)
- **npm** versi `9.x` atau lebih baru (sudah termasuk dengan Node.js)
- **MySQL** versi `8.x` → [Download](https://dev.mysql.com/downloads/mysql/) atau gunakan [XAMPP](https://www.apachefriends.org/)
- **Git** → [Download](https://git-scm.com/)

Cek versi yang terinstal:

```bash
node -v
npm -v
mysql --version
```

---

## 🚀 Panduan Instalasi & Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/Marvx-US/KLINIK_AISYIYAH.git
cd KLINIK_AISYIYAH
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Siapkan Database MySQL

Buka MySQL client (MySQL Workbench, phpMyAdmin, atau terminal), lalu buat database baru:

```sql
CREATE DATABASE klinik_aisyiyah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Konfigurasi Environment Variables

Buat file `.env` di root project (sejajar dengan `package.json`):

```bash
# Salin dari template
cp .env.example .env
```

Jika file `.env.example` tidak ada, buat file `.env` baru secara manual:

```env
# Koneksi Database MySQL
# Format: mysql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/klinik_aisyiyah"

# Secret untuk JWT (gunakan string acak yang panjang dan aman)
JWT_SECRET="ganti-dengan-string-rahasia-yang-sangat-panjang-dan-aman"

# URL aplikasi (untuk generate sitemap & metadata)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

> ⚠️ **Penting:** Sesuaikan `USER` dan `PASSWORD` dengan kredensial MySQL Anda. Jangan gunakan nilai default di production.

### 5. Jalankan Migrasi Database

Perintah ini akan membuat semua tabel di database sesuai skema Prisma:

```bash
npx prisma migrate dev --name init
```

Jika tabel sudah ada dan ingin menyinkronkan skema tanpa membuat migration baru:

```bash
npx prisma db push
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Isi Data Awal (Seeding)

Perintah ini akan membuat akun **Admin default** secara otomatis:

```bash
npx prisma db seed
```

Setelah seeding, akun admin yang terbuat adalah:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **Sangat dianjurkan** untuk mengganti password admin setelah login pertama kali di production.

### 8. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses:

- **Halaman Publik** → [http://localhost:3000](http://localhost:3000)
- **Portal Admin** → [http://localhost:3000/admin](http://localhost:3000/admin)
- **Halaman Login** → [http://localhost:3000/login](http://localhost:3000/login)

---

## 📁 Struktur Folder Utama

```
KLINIK_AISYIYAH/
├── prisma/
│   ├── schema.prisma       # Skema database
│   └── seed.js             # Data awal (admin default)
├── public/
│   ├── logo.png            # Logo klinik
│   └── uploads/            # Folder upload gambar
├── src/
│   ├── app/
│   │   ├── (public)/       # Halaman publik (beranda, artikel, event, dll)
│   │   ├── admin/          # Panel admin (layout + halaman kelola konten)
│   │   ├── actions/        # Server Actions (create, update, delete)
│   │   └── api/            # API Routes (upload, dll)
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   ├── sections/       # HeroSection, ServicesSection, dll
│   │   └── ui/             # Komponen reusable (Card, Button, dll)
│   ├── core/
│   │   ├── repositories/   # Akses langsung ke Prisma/DB
│   │   └── services/       # Business logic layer
│   └── lib/
│       ├── auth.ts         # Fungsi autentikasi JWT
│       ├── constants.ts    # Konstanta klinik (nama, alamat, jam operasional)
│       └── upload.ts       # Helper upload file
└── .env                    # Environment variables (TIDAK di-commit ke git)
```

---

## 🔧 Scripts yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server (hot reload) |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server (setelah build) |
| `npm run lint` | Cek kode dengan ESLint |
| `npx prisma studio` | Buka GUI database Prisma |
| `npx prisma migrate dev` | Buat & jalankan migrasi baru |
| `npx prisma db seed` | Isi data awal ke database |

---

## 🌐 Deployment

### Vercel (Direkomendasikan)

1. Push repository ke GitHub
2. Import project di [Vercel Dashboard](https://vercel.com/new)
3. Tambahkan environment variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_BASE_URL`) di Settings → Environment Variables
4. Vercel akan otomatis build dan deploy

> Pastikan database MySQL bisa diakses dari internet (gunakan layanan seperti [PlanetScale](https://planetscale.com/), [Railway](https://railway.app/), atau [Aiven](https://aiven.io/)).

---

## ❓ Troubleshooting

**Error: `DATABASE_URL` tidak valid**
→ Pastikan format URL benar dan MySQL server sedang berjalan.

**Error: `Table not found`**
→ Jalankan `npx prisma migrate dev` atau `npx prisma db push`.

**Error: `PrismaClientKnownRequestError` saat seeding**
→ Data sudah ada. Aman untuk diabaikan, seeding hanya membuat data jika belum ada.

**Port 3000 sudah digunakan**
→ Jalankan dengan port berbeda: `npm run dev -- -p 3001`

---

## 👤 Akun Default

Setelah menjalankan `npx prisma db seed`:

- **URL Login:** [http://localhost:3000/login](http://localhost:3000/login)
- **Username:** `admin`
- **Password:** `admin123`

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **Klinik Pratama Aisyiyah Pangkajene** — Sidenreng Rappang, Sulawesi Selatan.
