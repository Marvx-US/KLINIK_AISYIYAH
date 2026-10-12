# Panduan Deployment Klinik Pratama Aisyiyah (VPS Linux) 🚀

Dokumen ini berisi panduan langkah demi langkah untuk melakukan *deployment* website Klinik Pratama Aisyiyah pada layanan Virtual Private Server (VPS) berbasis Linux (misal: Ubuntu/Debian).

Aplikasi ini menggunakan **Next.js (App Router)**, **Prisma ORM**, dan **MySQL**.

---

## 🛠️ Prasyarat Server (VPS)

Sebelum memulai deployment, pastikan VPS Anda sudah terinstal beberapa komponen berikut:
1. **Node.js** (versi 18.x atau lebih baru)
2. **NPM** (biasanya sepaket dengan Node.js)
3. **MySQL Server** (versi 8.x direkomendasikan)
4. **Nginx** (berperan sebagai *Reverse Proxy* untuk meneruskan *request* dari domain ke aplikasi)
5. **PM2** (sebagai *Process Manager* agar aplikasi tetap berjalan di latar belakang)
   - Cara install PM2: `npm install -g pm2`
6. **Git** (untuk *cloning* repositori)

---

## 🚀 Langkah-Langkah Deployment

### 1. Kloning Repositori

Masuk ke VPS Anda menggunakan SSH, arahkan ke direktori yang diinginkan (misal: `/var/www/`), lalu kloning dari GitHub:

```bash
cd /var/www/
git clone https://github.com/Marvx-US/KLINIK_AISYIYAH.git
cd KLINIK_AISYIYAH
```

### 2. Konfigurasi Environment Variable (.env)

Buat file konfigurasi `.env` dari template yang disediakan atau buat manual:

```bash
cp .env.example .env
# Atau buka dengan nano
nano .env
```

Isi dengan kredensial yang sesuai dengan server Anda:
```env
# Sesuaikan USER, PASSWORD, PORT, dan DATABASE_NAME
DATABASE_URL="mysql://root:password@localhost:3306/klinik_aisyiyah"

# Secret untuk JWT (gunakan string acak yang panjang dan aman)
NEXTAUTH_SECRET="ganti-dengan-string-rahasia-yang-sangat-panjang-dan-aman"

# URL aplikasi (Contoh: https://klinik-aisyiyah.com)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# (Opsional) Akun Superadmin Default
DEFAULT_ADMIN_USERNAME="admin_klinik"
DEFAULT_ADMIN_PASSWORD="KlinikAisyiyahSecure2024!"
```

### 3. Instalasi Dependensi & Database

Setelah variabel siap, instal semua paket yang diperlukan, lakukan penyesuaian *schema* database, dan bangun (build) aplikasi untuk versi production:

```bash
# 1. Install seluruh package npm
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Sinkronisasi tabel database MySQL (akan membuat tabel jika belum ada)
npx prisma db push

# 4. (Opsional) Lakukan Seeding Database awal jika ingin men-generate akun Admin default 
npx prisma db seed

# 5. Build Next.js app untuk production
npm run build
```

### 4. Menjalankan Aplikasi dengan PM2

Gunakan PM2 agar server Next.js tetap berjalan sekalipun terminal SSH ditutup, dan dapat *auto-restart* jika terjadi kendala atau *server reboot*.

```bash
# Jalankan aplikasi (nama proses diset menjadi 'klinik-aisyiyah')
pm2 start npm --name "klinik-aisyiyah" -- start

# Simpan konfigurasi PM2 agar aktif otomatis ketika server dinyalakan ulang
pm2 save
pm2 startup
```
*Aplikasi kini berjalan di localhost (port 3000).*

### 5. Konfigurasi Nginx (Reverse Proxy)

Agar website bisa diakses melalui nama domain (tanpa mengetikkan port `:3000` di URL), kita perlu mengatur *Server Block* di Nginx.

Buka konfigurasi Nginx baru:
```bash
sudo nano /etc/nginx/sites-available/klinik-aisyiyah
```

Masukkan blok kode berikut (ubah `domain-klinik.com` ke nama domain asli Anda):
```nginx
server {
    listen 80;
    server_name domain-klinik.com www.domain-klinik.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optimasi untuk folder /public/uploads/ agar file statis langsung diserve Nginx.
    # Catatan: Semua gambar yang diunggah admin sudah dikompresi ke format WebP
    # oleh sharp di src/lib/upload.ts — Nginx hanya perlu serve file WebP yang sudah optimal.
    location /uploads/ {
        alias /var/www/KLINIK_AISYIYAH/public/uploads/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, stale-while-revalidate=86400";
        add_header Vary "Accept-Encoding";
        # Aktifkan gzip untuk file yang belum dikompresi (fallback)
        gzip_static on;
    }
}
```

Aktifkan *Server Block* tersebut lalu periksa *syntax* dan *restart* Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/klinik-aisyiyah /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 6. Mengamankan dengan SSL / HTTPS (Let's Encrypt)

Sangat disarankan mengaktifkan SSL (HTTPS) gratis dari Certbot (Let's Encrypt):

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain-klinik.com -d www.domain-klinik.com
```
*Ikuti petunjuk di layar, lalu pilih opsi untuk mengalihkan otomatis (redirect) trafik dari HTTP ke HTTPS.*

---

## 🔄 Pembaruan di Masa Depan (Update Routine)

Jika Anda men-push perubahan baru ke GitHub dan ingin memperbaruinya di server VPS:

```bash
cd /var/www/KLINIK_AISYIYAH
git pull origin main

# Jika ada paket NPM baru
npm install 

# Jika ada pembaruan schema Prisma
npx prisma generate
npx prisma migrate deploy  # atau 'npx prisma db push'

# Bangun ulang aplikasi Next.js
npm run build

# Restart PM2
pm2 restart klinik-aisyiyah
```

---
✅ **Selesai!** Website Klinik Pratama Aisyiyah Anda kini sudah *live* sepenuhnya pada VPS Linux.
