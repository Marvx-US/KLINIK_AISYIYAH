# Buku Panduan Standar Clean Code & Arsitektur Modular (Engineering Handbook v2.0)

**Cakupan Proyek:** Aplikasi Web Full-Stack Modern (SaaS, Enterprise, E-Commerce, Sistem Informasi)  
**Referensi Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, ORM (Prisma / Drizzle), Relational DB (PostgreSQL / MySQL), Zustand, React Hook Form + Zod, Vitest + Playwright

Dokumen ini adalah **Single Source of Truth** (acuan utama) dalam penulisan kode lintas proyek. Mematuhi panduan ini secara disiplin akan mencegah *spaghetti code*, menutup celah keamanan dan *race condition* pada transaksi data, serta memastikan *codebase* tetap mudah dipelihara dan dikembangkan dalam jangka panjang—baik saat dikerjakan sendiri (*solo developer*), bersama tim, maupun dibantu oleh AI *Coding Assistant*.

---

## 1. Arsitektur Folder & Batas Modul (Feature-Driven Architecture)

Pendekatan yang digunakan adalah **Feature-Driven Architecture**. Seluruh logika bisnis dikelompokkan berdasarkan domain fiturnya di dalam `src/features/`, bukan dipisahkan secara kaku berdasarkan jenis teknologinya.

### 1.1 Pohon Struktur Folder Lengkap

```text
📦 project-root
 ┣ 📂 prisma
 ┃ ┣ 📜 schema.prisma          # Skema database utama
 ┃ ┗ 📜 seed.ts                # Data awal (Master Role, Kategori, Akun Superadmin)
 ┣ 📂 public                   # Aset statis (Logo, ikon, dokumen template, audio)
 ┣ 📂 src
 ┃ ┣ 📂 app                    # ⚠️ HANYA UNTUK ROUTING, LAYOUT, & HALAMAN UTAMA
 ┃ ┃ ┣ 📂 (auth)               # Route group autentikasi (tidak menambah segmen URL)
 ┃ ┃ ┃ ┗ 📂 login
 ┃ ┃ ┃   ┗ 📜 page.tsx
 ┃ ┃ ┣ 📂 (dashboard)          # Layout utama aplikasi setelah login
 ┃ ┃ ┃ ┣ 📂 users
 ┃ ┃ ┃ ┃ ┣ 📜 page.tsx         # Server Component (Fetch data awal & render fitur)
 ┃ ┃ ┃ ┃ ┣ 📜 loading.tsx      # Skeleton UI saat halaman dimuat
 ┃ ┃ ┃ ┃ ┗ 📜 error.tsx        # Tampilan tangkapan error spesifik halaman
 ┃ ┃ ┃ ┣ 📂 products
 ┃ ┃ ┃ ┣ 📂 orders
 ┃ ┃ ┃ ┃ ┗ 📂 [orderId]        # Dynamic route untuk halaman detail transaksi/pesanan
 ┃ ┃ ┃ ┣ 📂 payments
 ┃ ┃ ┃ ┣ 📂 reports
 ┃ ┃ ┃ ┗ 📜 layout.tsx         # Sidebar, Header, & Cek Sesi Login
 ┃ ┃ ┣ 📂 api                  # HANYA untuk Webhook eksternal (Payment Gateway, OAuth, Pihak Ketiga)
 ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┗ 📜 layout.tsx           # Root Layout (Font, Theme & Toast Provider)
 ┃ ┃
 ┃ ┣ 📂 components             # KOMPONEN UI GLOBAL (Bebas dari logika bisnis spesifik fitur)
 ┃ ┃ ┣ 📂 ui                   # Murni komponen dasar UI (Button, Dialog, Input, Select)
 ┃ ┃ ┣ 📂 shared               # Komponen gabungan lintas fitur (PageHeader, DataTable, SearchInput, StatusBadge)
 ┃ ┃ ┗ 📂 layout               # Sidebar, Topbar, UserNav, Breadcrumbs
 ┃ ┃
 ┃ ┣ 📂 features               # ✨ JANTUNG APLIKASI (MODULAR & TERISOLASI) ✨
 ┃ ┃ ┣ 📂 users
 ┃ ┃ ┃ ┣ 📂 actions            # Server Actions: Mutasi data (Create, Update, Soft-Delete)
 ┃ ┃ ┃ ┣ 📂 queries            # Data Access Layer: Fungsi ambil data (SELECT/Read) ke DB
 ┃ ┃ ┃ ┣ 📂 components         # Komponen UI khusus fitur Users (UserForm, UserProfileCard)
 ┃ ┃ ┃ ┣ 📂 hooks              # Custom React Hooks spesifik fitur Users
 ┃ ┃ ┃ ┣ 📂 schemas            # Skema validasi Zod (user-schema.ts)
 ┃ ┃ ┃ ┣ 📂 constants          # Konstanta spesifik fitur (opsi status akun, tipe member)
 ┃ ┃ ┃ ┗ 📂 types              # Interface/Type spesifik fitur Users
 ┃ ┃ ┣ 📂 products             # Modul Katalog, Inventori, Kategori
 ┃ ┃ ┣ 📂 orders               # Modul Keranjang, Checkout, Riwayat Pesanan
 ┃ ┃ ┣ 📂 payments             # Modul Tagihan, Verifikasi Pembayaran, Invoice
 ┃ ┃ ┗ 📂 integrations         # Modul Klien API Eksternal (Payment Gateway, WhatsApp/Email Sender)
 ┃ ┃
 ┃ ┣ 📂 hooks                  # Custom Hooks Global (useDebounce, useMediaQuery, useLocalStorage)
 ┃ ┣ 📂 lib                    # KONFIGURASI CORE & UTILITY MURNI
 ┃ ┃ ┣ 📜 env.ts               # Validasi Environment Variables menggunakan Zod (Fail-Fast)
 ┃ ┃ ┣ 📜 db.ts                # Singleton Database/ORM Client (misal: Prisma Client)
 ┃ ┃ ┣ 📜 auth.ts              # Konfigurasi Autentikasi & Role-Based Access Control (RBAC)
 ┃ ┃ ┣ 📜 errors.ts            # Custom Error Classes (AppError, UnauthorizedError, dll.)
 ┃ ┃ ┣ 📜 logger.ts            # Utilitas logging terstruktur & pencatatan Audit Trail
 ┃ ┃ ┣ 📜 utils.ts             # Fungsi helper murni (cn, formatCurrency, formatDate)
 ┃ ┃ ┗ 📜 action-client.ts     # Wrapper standar untuk eksekusi Server Actions
 ┃ ┃
 ┃ ┣ 📂 constants              # Konstanta Global (Daftar Role, Konfigurasi Aplikasi, Limit Paginasi)
 ┃ ┗ 📂 types                  # Tipe TypeScript Global (ActionResponse, PaginationParams, PaginatedResult)
 ┣ 📂 tests                    # Pengujian E2E (Playwright) & integrasi lintas modul
 ┣ 📜 .env
 ┣ 📜 proxy.ts                 # Proteksi rute level jaringan (atau middleware.ts pada Next.js < 16)
 ┗ 📜 tsconfig.json
```

### 1.2 Aturan Aliran Impor Satu Arah (Unidirectional Import Rule)

Untuk mencegah *Circular Dependency* (File A mengimpor File B, dan File B mengimpor File A hingga menyebabkan kegagalan *build* atau *runtime crash*), patuhi hierarki aliran impor berikut:

1. **Level Dasar (`src/lib/`, `src/components/ui/`, `src/types/`, `src/constants/`):**
   - **DILARANG** mengimpor apa pun dari `src/features/` atau `src/app/`.
2. **Level Fitur (`src/features/[nama-fitur]/`):**
   - Boleh mengimpor dari `src/lib/`, `src/components/`, `src/hooks/`, `src/constants/`, dan `src/types/`.
   - **Aturan Lintas Fitur:** Fitur `orders` tidak boleh mengimpor komponen UI langsung dari `features/products/components`. Jika sebuah komponen dibutuhkan oleh dua fitur berbeda (misalnya `ProductSummaryTable`), pindahkan komponen tersebut ke `src/components/shared/`, atau batasi impor lintas fitur hanya pada fungsi *query* dan *types*-nya saja.
3. **Level Perakit / Aplikasi (`src/app/`):**
   - Bertugas sebagai perakit (*composer*). Boleh mengimpor dari `src/features/`, `src/components/`, dan `src/lib/`.
4. **Selalu Gunakan Path Alias (`@/`):**

```typescript
// ❌ BURUK: Relative path yang panjang dan rapuh saat file dipindah
import { formatCurrency } from "../../../lib/utils";

// ✅ BERSIH: Konsisten menggunakan Path Alias
import { formatCurrency } from "@/lib/utils";
```

### 1.3 Hindari *Barrel Files* (`index.ts`) pada Folder Fitur

Jangan membuat file `index.ts` yang me-*re-export* seluruh komponen, *queries*, dan *actions* di dalam satu fitur. Pada arsitektur React Server Components, *barrel file* dapat merusak *tree-shaking* dan menyebabkan modul khusus Server (`queries/`) tidak sengaja tertarik ke dalam bundel Client Component. Selalu impor langsung dari path file aslinya:

```typescript
// ❌ BURUK: Mengimpor dari barrel file yang mencampur kode Server & Client
import { OrderForm, getOrderById } from "@/features/orders";

// ✅ BERSIH: Impor langsung ke file spesifik
import { OrderForm } from "@/features/orders/components/order-form";
import { getOrderById } from "@/features/orders/queries/get-order-by-id";
```

---

## 2. Konvensi Penamaan & Bahasa (Naming Conventions)

Konsistensi penamaan membuat setiap pengembang dapat menebak isi file, variabel, atau fungsi tanpa harus membuka implementasinya terlebih dahulu.

### 2.1 Aturan Bahasa (Domain vs. Teknis)

Pilih salah satu pendekatan di bawah ini pada awal proyek dan terapkan secara konsisten:
- **Opsi A (Full English):** Seluruh istilah bisnis dan teknis menggunakan Bahasa Inggris (`User`, `Order`, `Product`, `Invoice`). Direkomendasikan untuk produk SaaS umum.
- **Opsi B (Hybrid — Domain Lokal + Technical English):** Istilah bisnis mengikuti regulasi/istilah operasional lokal (`Pegawai`, `Tagihan`, `RekamMedis`, `Obat`), sedangkan kata kerja teknis menggunakan Bahasa Inggris (`get...`, `create...`, `update...`, `delete...`, `validate...`, `format...`, `use...`, `is...`, `has...`).

### 2.2 Tabel Standar Penamaan

| Kategori | Format | Contoh Benar (✅) | Contoh Salah (❌) |
| :--- | :--- | :--- | :--- |
| **Folder & File** | `kebab-case` | `order-form.tsx`, `user-queries.ts` | `OrderForm.tsx`, `user_queries.ts` |
| **Komponen React** | `PascalCase` | `export function OrderForm()` | `export function orderForm()` |
| **Fungsi & Variabel** | `camelCase` | `const totalOrderAmount = 150000;` | `const Total_Order_Amount = 150000;` |
| **Variabel Boolean** | `is/has/can/should` + `camelCase` | `isVerified`, `hasActiveSubscription`, `canEditPost` | `verified`, `statusSubscription`, `editPost` |
| **Konstanta Global / Enum** | `UPPER_SNAKE_CASE` | `MAX_ITEMS_PER_PAGE = 20`, `ORDER_STATUS` | `maxItemsPerPage = 20` |
| **Type & Interface** | `PascalCase` | `type OrderDetailPayload = { ... }` | `type order_detail_payload = { ... }` |
| **Custom Hooks** | `use` + `camelCase` | `useShoppingCart()`, `useSearchProducts()` | `shoppingCartHook()` |
| **File Server Actions** | `[kata-kerja]-[entitas].ts` | `create-order.ts`, `cancel-invoice.ts` | `action1.ts`, `process.ts` |
| **File Queries (Read)** | `get-[entitas].ts` | `get-orders.ts`, `get-product-by-slug.ts` | `fetch.ts`, `data.ts` |

### 2.3 Penamaan Event Handler di React

Pisahkan penamaan antara *props* komponen dengan fungsi internal penangan *event*:
- Gunakan awalan `on...` untuk deklarasi nama *props* komponen.
- Gunakan awalan `handle...` untuk fungsi internal yang mengeksekusi logika tersebut.

```tsx
// ✅ BERSIH & JELAS
interface ProductItemProps {
  onSelectProduct: (productId: string) => void;
}

export function ProductItem({ onSelectProduct }: ProductItemProps) {
  function handleRowClick(id: string) {
    // Logika internal sebelum memanggil prop
    onSelectProduct(id);
  }
  // ...
}
```

---

## 3. Prinsip Clean Code pada Fungsi & Logika Bisnis

### 3.1 Gunakan Early Return Pattern (Hindari Nested If / Arrow Code)

Hindari menumpuk blok `if-else` terlalu dalam. Periksa kondisi yang tidak valid di awal fungsi (*Guard Clauses*) dan langsung hentikan eksekusi (`return`).

```typescript
// ❌ BURUK: Menjorok terlalu dalam dan sulit ditelusuri
export async function processOrderPayment(orderId: string, paidAmount: number) {
  const invoice = await getInvoice(orderId);
  if (invoice) {
    if (invoice.status !== "PAID") {
      if (paidAmount >= invoice.grandTotal) {
        await executePayment(invoice.id, paidAmount);
        return { success: true };
      } else {
        return { error: "Nominal pembayaran kurang" };
      }
    } else {
      return { error: "Tagihan sudah dibayar sebelumnya" };
    }
  } else {
    return { error: "Tagihan tidak ditemukan" };
  }
}

// ✅ BERSIH: Early Return / Guard Clauses — Rata kiri & mudah dibaca
export async function processOrderPayment(orderId: string, paidAmount: number) {
  const invoice = await getInvoice(orderId);

  if (!invoice) {
    return { success: false, error: "Tagihan tidak ditemukan." };
  }
  if (invoice.status === "PAID") {
    return { success: false, error: "Tagihan ini sudah lunas sebelumnya." };
  }
  if (paidAmount < invoice.grandTotal) {
    return { success: false, error: "Nominal pembayaran kurang dari total tagihan." };
  }

  // Happy Path selalu berada di bagian paling bawah dan rata kiri
  await executePayment(invoice.id, paidAmount);
  return { success: true };
}
```

### 3.2 Larangan Magic Strings & Magic Numbers

Jangan menulis nilai teks status atau angka rumus secara langsung (*hardcode*) di berbagai tempat. Kesalahan ketik satu huruf dapat memicu *bug* logika yang sulit dilacak.

```typescript
// ❌ BURUK: Rawan salah ketik dan angka tidak memiliki konteks
if (order.status === "WAITING_APPROVAL") { ... }
const taxAmount = subTotal * 0.11; // Angka 0.11 ini apa?

// ✅ BERSIH: Gunakan Konstanta bernama jelas atau Enum dari skema database
import { OrderStatus } from "@prisma/client";

const PPN_TAX_RATE = 0.11;

if (order.status === OrderStatus.WAITING_APPROVAL) { ... }
const taxAmount = Math.round(subTotal * PPN_TAX_RATE);
```

### 3.3 Satu Fungsi = Satu Tugas (Single Responsibility Principle)

- Sebuah fungsi hanya boleh melakukan satu tanggung jawab spesifik. Jika nama fungsi mengandung kata **"Dan"** (contoh: `validateUserAndCreateOrderAndSendEmail()`), pecah menjadi tiga fungsi terpisah: `validateUser()`, `createOrder()`, dan `sendConfirmationEmail()`.
- **Batas Parameter Fungsi:** Maksimal **2 parameter**. Jika membutuhkan 3 parameter atau lebih, bungkus ke dalam **Object Parameter** (*Destructuring*) agar urutan pemanggilan tidak tertukar.

```typescript
// ❌ BURUK: Urutan parameter rawan tertukar saat dipanggil
function calculateItemPrice(basePrice: number, quantity: number, discountPercent: number, shippingFee: number) {}

// ✅ BERSIH: Self-documenting dan urutan properti tidak masalah
interface CalculateItemPriceParams {
  basePrice: number;
  quantity: number;
  discountPercent?: number;
  shippingFee?: number;
}

function calculateItemPrice({
  basePrice,
  quantity,
  discountPercent = 0,
  shippingFee = 0,
}: CalculateItemPriceParams) {
  // ...
}
```

### 3.4 Aturan Penulisan Komentar (Comments)

- **Jangan** menulis komentar untuk menjelaskan **APA** yang dilakukan kode—biarkan nama variabel dan fungsi yang menjelaskannya.
- Tulislah komentar **HANYA** untuk menjelaskan **MENGAPA (WHY)** suatu keputusan bisnis, batasan sistem pihak ketiga, atau *workaround* teknis diambil.

```typescript
// ❌ KOMENTAR TIDAK PERLU (Sudah jelas dari kodenya)
// Mengurangi stok produk dengan jumlah yang dibeli
productStock = productStock - purchasedQuantity;

// ✅ KOMENTAR BERHARGA (Menjelaskan batasan eksternal / aturan bisnis)
// API Payment Gateway menolak transaksi di bawah Rp10.000 untuk metode Virtual Account
if (paymentMethod === "VIRTUAL_ACCOUNT" && totalAmount < 10_000) { ... }
```

---

## 4. Modularisasi Komponen, UI, & Performa Rendering

### 4.1 Batas Ukuran File & Dekomposisi Komponen

- **Batas Kuning (150 Baris):** Evaluasi apakah ada logika state, validasi, atau pemformatan data yang sebaiknya diekstrak ke *custom hook* atau fungsi utilitas.
- **Batas Merah (250 Baris):** **WAJIB DIPECAH.** Tidak boleh ada satu pun file komponen `.tsx` yang melebihi 250–300 baris.

**Contoh Dekomposisi Halaman Kompleks (Misal: Halaman Checkout / Detail Transaksi):**  
Jangan menumpuk seluruh kode di dalam satu file `checkout-page.tsx`. Pecah menjadi sub-komponen yang terfokus:
1. `customer-address-section.tsx` (Bagian pemilihan alamat pengiriman).
2. `order-items-list.tsx` (Daftar produk yang dibeli beserta kuantitasnya).
3. `voucher-selector-combobox.tsx` (Komponen khusus pencarian dan penerapan kode promo).
4. `payment-summary-card.tsx` (Ringkasan rincian biaya, pajak, dan tombol bayar).
5. `checkout-container.tsx` (Komponen perakit yang menyatukan bagian-bagian di atas).

### 4.2 Pisahkan Logika UI ke dalam Custom Hooks

Jangan mengotori bagian atas komponen UI dengan deretan panjang `useState` dan `useEffect`. Jika logika interaksinya kompleks, ekstrak ke dalam folder `hooks/`.

```tsx
// ❌ BURUK: Logika pencarian, debounce, dan fetch menumpuk di dalam komponen UI
export function ProductSearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    /* 30 baris logika fetch & debounce */
  }, [query]);
  return <div>...</div>;
}

// ✅ BERSIH: Komponen UI hanya fokus merender tampilan
export function ProductSearchBox() {
  const { query, setQuery, products, isLoading } = useSearchProducts();
  return <div>...</div>;
}
```

### 4.3 Aturan Server Component vs. Client Component

- **Server Component adalah Default:** Seluruh `page.tsx` dan komponen yang hanya bertugas menampilkan data wajib berupa Server Component (tanpa direktif `"use client"`).
- **Dorong `"use client"` ke Daun Terluar (*Push Client to the Leaves*):**
  - Jika halaman Daftar Produk memiliki Tabel (statis) dan Tombol "Tambah Produk" (membutuhkan state buka/tutup modal), **jangan** jadikan seluruh halaman atau tabel sebagai Client Component.
  - Biarkan `page.tsx` dan `ProductTable` tetap menjadi Server Component, lalu buat komponen kecil terpisah khusus untuk tombol dan modalnya yang menggunakan `"use client"`.

### 4.4 Pola Komposisi *Slot / Children* (Server di dalam Client)

Jika sebuah Client Component (misalnya `CollapsibleSidebar` atau `AnimatedModal`) perlu membungkus komponen yang mengambil data dari server, jangan mengimpor Server Component secara langsung di dalam file `"use client"`. Teruskan Server Component tersebut melalui prop `children`:

```tsx
// ✅ BERSIH: Server Component tetap dieksekusi di server meskipun dibungkus ClientWrapper
// src/app/(dashboard)/page.tsx (Server Component)
export default function DashboardPage() {
  return (
    <ClientTabsWrapper>
      <RevenueChartServer/> {/* Tetap murni Server Component */}
    </ClientTabsWrapper>
  );
}
```

### 4.5 Pencegahan *Request Waterfall* & Penggunaan `<Suspense>`

- **Parallel Data Fetching:** Jika satu halaman membutuhkan dua atau lebih *query* independen, **dilarang** memanggil `await` secara berurutan. Gunakan `Promise.all()` agar kedua *query* berjalan bersamaan.
- **Granular Streaming:** Untuk bagian halaman yang membutuhkan *query* berat (misal rekap laporan tahunan), bungkus dengan `<Suspense fallback={<ReportSkeleton />}>` agar pengguna bisa langsung melihat navigasi dan bagian halaman lain tanpa menunggu layar putih selesai dimuat.

```tsx
// ❌ BURUK: Request Waterfall (Query kedua menunggu Query pertama selesai)
const summary = await getDashboardSummary();
const recentOrders = await getRecentOrders();

// ✅ BERSIH: Eksekusi paralel (Waktu tunggu dipangkas hingga 50%)
const [summary, recentOrders] = await Promise.all([
  getDashboardSummary(),
  getRecentOrders(),
]);
```

---

## 5. Aturan Ketat TypeScript & Environment (Zero `any` Policy)

TypeScript adalah jaring pengaman utama terhadap *runtime error*.

### 5.1 Larangan `any` & Inferensi Skema Otomatis

- **DILARANG KERAS Menggunakan `any`:** Menggunakan `any` sama dengan mematikan pemeriksaan tipe TypeScript. Jika tipe data belum diketahui (misalnya dari input eksternal, webhook, atau blok `catch`), gunakan `unknown` lalu lakukan *type narrowing* atau validasi menggunakan Zod.
- **Jangan Menulis Ulang Tipe Database/Form secara Manual:** Manfaatkan inferensi otomatis dari Zod atau ORM (seperti Prisma/Drizzle) agar tipe data selalu sinkron dengan skema terbaru.

```typescript
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { OrderSchema } from "../schemas/order-schema";

// ✅ 1. Mengambil tipe otomatis dari Skema Zod untuk Form
export type OrderFormValues = z.infer<typeof OrderSchema>;

// ✅ 2. Mengambil tipe otomatis dari ORM beserta Relasinya (Include)
export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    payment: true;
    items: {
      include: { product: true };
    };
  };
}>;
```

### 5.2 Validasi Environment Variables (*Fail-Fast Principle*)

Jangan pernah memanggil `process.env.NAMA_VARIABEL` secara langsung di berbagai file bisnis. Validasi seluruh *environment variables* menggunakan Zod di dalam `src/lib/env.ts` agar aplikasi langsung memberikan peringatan jelas saat pertama kali dijalankan jika ada konfigurasi `.env` yang belum lengkap.

```typescript
// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL harus berupa URL koneksi yang valid"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET minimal 32 karakter"),
  PAYMENT_WEBHOOK_SECRET: z.string().min(1, "PAYMENT_WEBHOOK_SECRET wajib diisi"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
```

---

## 6. Standar Database, Queries (Read), & Actions (Write)

Untuk menjaga keamanan dan kerapihan akses data, pisahkan secara tegas antara operasi **Baca (Queries)** dan operasi **Tulis/Mutasi (Actions)**.

### 6.1 Pemisahan `queries/` vs. `actions/`

- **`src/features/[fitur]/queries/` (Data Access Layer — READ):**
  - Berisi fungsi `async` untuk mengambil data dari database (`findMany`, `findUnique`, `count`).
  - Dipanggil langsung di dalam Server Components.
  - Wajib menyertakan `import "server-only"` di baris pertama agar modul tidak pernah tidak sengaja terbundel ke sisi *client*.
- **`src/features/[fitur]/actions/` (Server Actions — WRITE):**
  - Berisi fungsi mutasi data (`create`, `update`, `delete`).
  - Wajib diawali dengan `"use server"` di baris pertama.
  - Dipanggil dari Client Components (misalnya saat pengiriman form atau aksi tombol).

### 6.2 Standar Paginasi Paralel & Pencegahan *N+1 Query*

- **Dilarang Memanggil `findMany()` Tanpa Limit:** Setiap pengambilan daftar data wajib membatasi jumlah baris (`take`) dan memilih kolom yang diperlukan saja (`select`).
- **Dilarang Melakukan Query di dalam Looping (*N+1 Query Problem*):** Jangan pernah memanggil `await db...` di dalam blok `for` atau `array.map()` untuk mengambil data relasi. Gunakan `include` atau ambil sekaligus menggunakan klausa `where: { id: { in: ids } }`.

```typescript
// src/features/products/queries/get-products.ts
import "server-only";
import db from "@/lib/db";
import { PaginatedResult } from "@/types";

const MAX_PAGE_SIZE = 50;

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getProducts({
  page = 1,
  pageSize = 10,
  search = "",
}: GetProductsParams) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
  const skip = (safePage - 1) * safeLimit;

  const whereClause = {
    deletedAt: null,
    ...(search && {
      name: { contains: search, mode: "insensitive" as const },
    }),
  };

  // ✅ Ambil data baris dan hitung total secara paralel
  const [items, totalCount] = await Promise.all([
    db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        sku: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
    }),
    db.product.count({ where: whereClause }),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      pageSize: safeLimit,
      totalCount,
      totalPages: Math.ceil(totalCount / safeLimit),
    },
  };
}
```

### 6.3 Format Standar Response Server Action

Seluruh Server Actions wajib mengembalikan struktur objek (*return type*) yang seragam agar penanganan pesan umpan balik (*Toast* atau pesan error form) di sisi UI selalu konsisten:

```typescript
// src/types/index.ts
export type ActionResponse<T void> = {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};
```

### 6.4 Template Wajib Server Action (Lima Langkah Aman & Bebas Race Condition)

Setiap mutasi data wajib mengikuti 5 tahapan berurutan:
1. **Cek Sesi & Hak Akses (RBAC)**
2. **Validasi Input (Zod)**
3. **Kalkulasi Harga/Kuota di Server & Eksekusi Database Atomik (`$transaction`)**
4. **Tangani Error Bisnis secara Terukur**
5. **Revalidate Cache & Kembalikan Response Standar**

```typescript
// src/features/orders/actions/create-order.ts
"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CreateOrderSchema } from "../schemas/order-schema";
import { ActionResponse } from "@/types";

export async function createOrder(rawInput: unknown): Promise<ActionResponse<{ id: string }>> {
  // 1. CEK AUTENTIKASI & HAK AKSES (RBAC)
  const user = await getCurrentUser();
  if (!user || !["CUSTOMER", "ADMIN"].includes(user.role)) {
    return { success: false, message: "Akses ditolak. Silakan masuk terlebih dahulu." };
  }

  // 2. VALIDASI INPUT DENGAN ZOD
  const parsed = CreateOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data pesanan belum lengkap atau tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { items, paymentMethod } = parsed.data;

  try {
    // 3 & 4. EKSEKUSI DATABASE DALAM SATU TRANSAKSI ATOMIK (ACID)
    // Mencegah race condition (overselling/stok minus) & manipulasi harga dari client
    const result = await db.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true, deletedAt: null },
        select: { id: true, price: true, name: true },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));
      let grandTotal = 0;

      const orderItemsPayload = items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`PRODUK_TIDAK_VALID:${item.productId}`);
        }
        // Selalu gunakan harga dari database server, BUKAN dari input client!
        const subTotal = product.price * item.quantity;
        grandTotal += subTotal;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      });

      // Potong stok secara atomik dengan syarat stok >= quantity
      for (const item of items) {
        const updatedProduct = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (updatedProduct.count === 0) {
          throw new Error(`STOK_TIDAK_CUKUP:${item.productId}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          customerId: user.id,
          status: "PENDING_PAYMENT",
          paymentMethod,
          grandTotal,
          items: {
            create: orderItemsPayload,
          },
        },
      });

      return newOrder;
    });

    // 5. REVALIDATE CACHE HALAMAN & KEMBALIKAN RESPONSE STANDAR
    revalidatePath("/orders");
    revalidatePath("/products");

    return {
      success: true,
      message: "Pesanan berhasil dibuat.",
      data: { id: result.id },
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("STOK_TIDAK_CUKUP:")) {
        return {
          success: false,
          message: "Stok salah satu produk tidak mencukupi.",
        };
      }
      if (error.message.startsWith("PRODUK_TIDAK_VALID:")) {
        return {
          success: false,
          message: "Salah satu produk tidak ditemukan atau sudah tidak aktif.",
        };
      }
    }

    console.error("[CREATE_ORDER_ERROR]:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server saat memproses pesanan.",
    };
  }
}
```

> **Catatan Penting Penggunaan `redirect()` di Server Actions:**  
> Di Next.js, fungsi `redirect()` dari `next/navigation` bekerja dengan melempar *internal exception* (`NEXT_REDIRECT`). Jika Server Action membutuhkan perpindahan halaman otomatis lewat server, panggil `redirect()` **di luar (setelah) blok `try-catch`** agar tidak tertangkap sebagai error gagal oleh blok `catch`.

---

## 7. Integritas Data & Aturan Skema Database (Data Integrity Rules)

1. **Hindari Hard Delete pada Data Transaksional & Historis:**
   - Data penting seperti riwayat transaksi, invoice, rekam medis, log audit, dan akun pengguna yang memiliki relasi historis **dilarang dihapus permanen** (`DELETE FROM`).
   - Terapkan mekanisme **Soft Delete** menggunakan kolom `deletedAt DateTime?`, `isActive Boolean @default(true)`, atau perubahan status menjadi `CANCELLED` / `ARCHIVED` disertai pencatatan alasan (`cancelReason`).
2. **Kewajiban Database Transaction (`$transaction`):**
   - Setiap operasi yang mengubah lebih dari satu tabel secara berantai (misalnya: pemotongan stok inventori, pembuatan tagihan, dan pencatatan jurnal keuangan) **wajib** dibungkus dalam transaksi database. Jika salah satu langkah gagal di tengah jalan, seluruh perubahan sebelumnya harus dibatalkan (*rollback*) secara otomatis.
3. **Presisi Angka Keuangan & Kuantitas:**
   - Untuk menyimpan nominal mata uang atau angka desimal presisi tinggi di database relasional, gunakan tipe `Int` / `BigInt` (simpan dalam satuan terkecil/sen atau Rupiah utuh) atau `Decimal` / `Numeric`.
   - **Jangan pernah** menggunakan tipe `Float` atau `Double` untuk perhitungan uang karena masalah ketidakakuratan *floating-point* biner (`0.1 + 0.2 !== 0.3`).
4. **Kewajiban Database Indexing (`@@index`):**
   - Setiap kolom *Foreign Key* (`customerId`, `productId`), kolom filter status (`status`, `deletedAt`), dan kolom pencarian teks/tanggal (`createdAt`, `sku`) wajib diberikan `@@index` pada skema database untuk mencegah *Full Table Scan* saat data mencapai ratusan ribu baris.

---

## 8. Standar Keamanan Aplikasi & Integrasi Eksternal (Security Hardening)

### 8.1 Larangan Mempercayai Input Client (*Zero Client Trust & Anti-IDOR*)

- **Jangan Ambil Identitas atau Harga dari Client:** Saat pengguna membuat pesanan atau mengubah profil, **dilarang** menerima `userId`, `role`, atau `unitPrice` dari payload form *client*. Selalu ambil identitas pengguna dari sesi server (`await getCurrentUser()`) dan harga barang dari database.
- **Verifikasi Kepemilikan Data (*Anti-IDOR*):** Saat pengguna mengakses atau mengubah data berdasarkan ID (misal `updateOrder(orderId)`), wajib periksa di klausa `where` apakah data tersebut benar-benar milik pengguna yang sedang login (`where: { id: orderId, customerId: user.id }`), kecuali pengguna memiliki role `ADMIN`.

### 8.2 Keamanan Webhook & *Idempotency* (`src/app/api/webhooks/`)

Saat menerima *callback/webhook* dari layanan pihak ketiga (seperti Midtrans, Xendit, Stripe, atau WhatsApp Gateway):
1. **Wajib Verifikasi Signature:** Validasi *header signature* menggunakan `PAYMENT_WEBHOOK_SECRET` (HMAC SHA-256) sebelum memproses isi payload.
2. **Terapkan Idempotency:** Pihak ketiga sering mengirim ulang webhook yang sama jika jaringan sempat lambat. Pastikan kode mengecek status transaksi terlebih dahulu di dalam transaksi database—jika status sudah `PAID`, langsung kembalikan HTTP `200 OK` tanpa menambahkan saldo atau memotong stok dua kali.

### 8.3 Keamanan Unggah File (*File Upload Validation*)

- Jangan hanya memvalidasi ekstensi file di sisi *client* (`accept=".jpg,.png"`).
- Validasi ukuran maksimal file (misal maks 2MB–5MB) dan tipe MIME di sisi server.
- Simpan file yang diunggah ke *Object Storage* terpisah (seperti S3, Cloudflare R2, atau Supabase Storage) menggunakan nama file acak berbasis UUID/hash, **bukan** nama file asli dari pengguna untuk mencegah *Path Traversal*.

---

## 9. Penanganan Error, Logging Terstruktur, & Audit Trail

### 9.1 Pemisahan Pesan Error Pengguna vs. Log Server

- **Ke Pengguna (UI):** Tampilkan pesan bahasa manusia yang jelas, sopan, dan mengarahkan solusi (Contoh: *"Stok barang tidak mencukupi"* atau *"Sesi Anda telah berakhir, silakan login kembali"*). **Dilarang keras** menampilkan pesan error mentah dari database/ORM (seperti `PrismaClientKnownRequestError: Unique constraint failed on the fields: (email)`) langsung ke layar pengguna.
- **Ke Server (`logger`):** Catat detail teknis lengkap beserta konteks (`userId`, `actionName`, `payload`, `errorStack`) menggunakan format JSON terstruktur agar mudah ditelusuri saat terjadi insiden.

### 9.2 Kewajiban *Audit Trail* pada Operasi Sensitif

Untuk aplikasi sistem informasi, keuangan, kesehatan, atau inventori, setiap perubahan data krusial (perubahan harga barang, penyesuaian stok manual/*stock opname*, pembatalan invoice, perubahan hak akses) wajib mencatat baris baru ke tabel `AuditLog`:

```typescript
// Contoh pencatatan Audit Log di dalam $transaction
await tx.auditLog.create({
  data: {
    actorId: user.id,
    action: "MANUAL_STOCK_ADJUSTMENT",
    entityType: "PRODUCT",
    entityId: product.id,
    oldValue: { stock: product.stock },
    newValue: { stock: newStockCount },
    reason: parsed.data.adjustmentReason,
  },
});
```

---

## 10. Hierarki Manajemen State (State Management Rules)

Jangan menyimpan seluruh state di dalam `useState` atau *global store* (Zustand/Redux). Tempatkan state sesuai dengan peruntukannya:

1. **URL State (`searchParams`) → Prioritas Utama untuk Filter & Navigasi:**
   - Gunakan URL untuk menyimpan kata kunci pencarian (`?q=laptop`), posisi halaman paginasi (`?page=2`), filter rentang tanggal (`?from=2026-01-01`), dan tab aktif (`?tab=analytics`).
   - **Keuntungan:** Halaman dapat dibagikan lewat tautan (*shareable URL*), dapat di-*bookmark*, dan posisi tampilan tidak hilang saat pengguna memuat ulang (*refresh*) browser.
2. **Server State (Framework Cache & Database):**
   - Data yang diambil dari database tidak perlu disalin ke dalam global state Zustand. Biarkan Server Component yang mengambil data dan meneruskannya ke komponen anak melalui *props*.
3. **Local UI State (`useState`):**
   - Gunakan khusus untuk interaksi antarmuka lokal yang terisolasi pada satu komponen (misalnya: membuka/menutup Dialog Modal, *toggle* visibilitas *password*, atau membuka *Dropdown*).
4. **Form State (React Hook Form):**
   - Seluruh input form yang memiliki validasi wajib dikelola oleh `useForm()` dari React Hook Form yang diintegrasikan dengan `zodResolver`.
5. **Global Client State (Zustand):**
   - Gunakan hanya untuk data sementara lintas komponen di sisi klien sebelum dikirim ke server, atau fitur antarmuka global (misalnya: *Shopping Cart* lokal, *POS Kasir Draft* di `localStorage`, atau kontrol pemutar media/notifikasi global).

---

## 11. Standar Styling, Design System, & Aksesibilitas

1. **Gunakan Fungsi `cn()` untuk Menggabungkan Class Dinamis:**
   - Saat menerapkan class CSS bersyarat, selalu gunakan helper `cn()` dari `@/lib/utils` (kombinasi `clsx` dan `tailwind-merge`) untuk menghindari konflik class Tailwind.

```tsx
// ✅ BERSIH
<Badge "COMPLETED" "URGENT" "bg-green-100 "bg-red-100 "px-2 && )} className="{cn(" font-medium", py-1 status="==" text-green-800" text-red-800", text-xs>
  {status}
</Badge>
```

2. **Gunakan Variabel Warna Semantik (*Design Tokens*):**
   - Hindari menulis kode warna spesifik secara acak di tiap halaman (misal `bg-blue-500` di halaman A, lalu `bg-sky-600` di halaman B).
   - Gunakan kelas semantik seperti `bg-primary`, `text-muted-foreground`, `bg-destructive`, dan `border-input` agar perubahan tema merek atau dukungan *Dark Mode* terpusat di satu file konfigurasi (`globals.css`).
3. **Aksesibilitas & Ketahanan UI (*UI Resilience*):**
   - Setiap tombol yang hanya berisi ikon (tanpa teks) wajib menyertakan `aria-label` atau `<span className="sr-only">Deskripsi Aksi</span>`.
   - Setiap halaman daftar data wajib memiliki 3 tampilan keadaan: **Loading State** (`Skeleton`), **Empty State** (ilustrasi/pesan ramah saat data masih kosong beserta tombol CTA), dan **Data State**.

---

## 12. Strategi Pengujian (Testing) & Standar Git

### 12.1 Piramida Pengujian Praktis

Fokuskan waktu pengujian pada bagian yang memiliki risiko bisnis tertinggi:
1. **Unit Testing (Vitest):** Wajib dibuat untuk fungsi utilitas perhitungan murni (kalkulasi diskon bertingkat, pajak, pembagian komisi, konversi dosis/satuan) dan validasi skema Zod yang kompleks.
2. **End-to-End Testing (Playwright):** Wajib mencakup *Critical User Journey* (Alur Login $\rightarrow$ Pembuatan Transaksi Utama $\rightarrow$ Verifikasi Pembayaran).

### 12.2 Format Conventional Commits

Gunakan format **Conventional Commits** pada setiap pesan *commit* Git agar riwayat perubahan proyek terstruktur dan mudah dilacak:

- `feat(orders): tambah fitur ekspor laporan pesanan ke PDF`
- `fix(payments): perbaiki pembulatan perhitungan diskon kupon`
- `refactor(products): pecah komponen form produk menjadi sub-komponen`
- `schema(db): tambah indeks pencarian pada kolom email dan kode produk`
- `security(webhooks): tambah verifikasi signature HMAC pada callback pembayaran`
- `chore(deps): perbarui dependensi validasi dan komponen UI`

### 12.3 Checklist Mandiri Sebelum Menutup Fitur / Pull Request

- [ ] Apakah ada file yang panjangnya melebihi **250 baris**? *(Jika ya, pecah menjadi sub-komponen atau custom hook sekarang).*
- [ ] Apakah ada tipe `any` yang terselip? *(Ganti dengan tipe eksplisit, inferensi skema, atau `unknown`).*
- [ ] Apakah perintah `tsc --noEmit` dan `npm run lint` berjalan bersih dengan **0 error**?
- [ ] Apakah variabel `.env` baru sudah didaftarkan ke skema validasi di `src/lib/env.ts`?
- [ ] Apakah setiap fungsi di folder `queries/` sudah menyertakan `import "server-only"`, menggunakan `Promise.all` bila ada multi-query, serta menerapkan batas paginasi (`take` / `skip`)?
- [ ] Apakah setiap mutasi data (*Server Action* / API Endpoint) sudah memeriksa sesi autentikasi, kepemilikan data (*Anti-IDOR*), hak akses role, dan validasi input Zod?
- [ ] Apakah kalkulasi nominal uang/harga diambil langsung dari database di server (bukan dari input form *client*) dan disimpan dalam tipe `Int`/`Decimal`?
- [ ] Apakah operasi database yang mengubah lebih dari satu tabel atau memotong kuota/stok sudah dibungkus secara atomik dalam `$transaction`?
- [ ] Apakah aksi sensitif sudah mencatat riwayat perubahan ke tabel `AuditLog`?
- [ ] Apakah tombol *Submit* pada form sudah memiliki atribut `disabled={isPending}` untuk mencegah pengiriman data ganda akibat klik berulang (*double submit*)?
- [ ] Apakah pengguna mendapatkan umpan balik visual yang jelas (*Loading State*, *Empty State*, *Toast Success*, atau *Toast Error*) pada setiap interaksi?