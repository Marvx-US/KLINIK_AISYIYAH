# Buku Panduan & Protokol Otonom Pengujian Otomatis (AI Agent Testing Playbook)

**Peran Dokumen:** Instruksi Wajib & Standar Operasional Pengujian (Single Source of Truth) untuk Developer & AI Coding Agent  
**Cakupan Pengujian:** Static Analysis, Unit Testing, Integration Testing (Server Actions & DAL), Component UI Testing, dan End-to-End (E2E) Testing  
**Referensi Tech Stack Testing:** TypeScript (`tsc`), Vitest, React Testing Library (RTL) + `@testing-library/user-event`, Mock Service Worker (MSW), Prisma/Drizzle Mock/Test DB, dan Playwright

---

## 0. MANDAT UTAMA UNTUK AI AGENT (AUTONOMOUS TESTING PROTOCOL)

> **⚠️ INSTRUKSI MUTLAK BAGI AI AGENT:**  
> Setiap kali Anda (AI Agent) diminta untuk **membuat fitur baru**, **mengubah logika bisnis**, **membuat Server Action / API**, atau **memperbaiki *bug***, Anda **WAJIB secara otomatis** membuat atau memperbarui file pengujian (*test files*) yang relevan.  
> **Tugas Anda BELUM SELESAI (*Not Done*) sebelum seluruh pengujian ditulis, dieksekusi melalui terminal, dan terbukti lulus 100% (*All Green / PASS*).**

### Siklus Kerja Otonom AI Agent (Wajib Dijalankan Berurutan)

1. **Analisis & Implementasi Fitur:** Tulis kode fitur sesuai standar di `ENGINEERING_HANDBOOK.md`.
2. **Pembuatan Test Otomatis (*Auto-Generate Tests*):** Tanpa menunggu perintah tambahan dari pengguna, langsung buat file pengujian untuk:
   - Skema validasi Zod & fungsi kalkulasi murni (*Unit Test*).
   - Server Actions & Queries (*Integration Test* mencakup RBAC, validasi gagal, aturan bisnis gagal, dan *Happy Path*).
   - Komponen Form/UI interaktif (*Component Test*).
   - Alur kritis pengguna jika menyentuh fitur utama (*E2E Playwright Test*).
3. **Eksekusi Mandiri via Terminal:** Jalankan perintah `npm run test:run` dan `npx tsc --noEmit`.
4. **Perbaikan Mandiri (*Self-Healing Loop*):** Jika ada pengujian yang gagal (*FAIL*), analisis pesan error-nya, perbaiki kode aplikasi atau kode pengujiannya, lalu jalankan ulang hingga **0 gagal**.
5. **Laporan Bukti Pengujian:** Pada akhir jawaban Anda kepada pengguna, tampilkan ringkasan hasil eksekusi pengujian yang telah lulus.

---

## 1. Arsitektur Folder & Penempatan File Pengujian

Untuk menjaga modularitas sesuai **Feature-Driven Architecture**, file pengujian Unit, Integrasi, dan Komponen ditempatkan **berdampingan di dalam modul fiturnya (*Co-located*)**, sedangkan pengujian lintas fitur (E2E) dan konfigurasi global ditempatkan di folder `tests/` pada *root* proyek.

```text
📦 project-root
 ┣ 📂 src
 ┃ ┣ 📂 features
 ┃ ┃ ┗ 📂 orders
 ┃ ┃   ┣ 📂 actions
 ┃ ┃   ┃ ┣ 📜 create-order.ts
 ┃ ┃   ┃ ┗ 📜 create-order.test.ts         # 🧪 Integration Test khusus Server Action ini
 ┃ ┃   ┣ 📂 queries
 ┃ ┃   ┃ ┣ 📜 get-orders.ts
 ┃ ┃   ┃ ┗ 📜 get-orders.test.ts           # 🧪 Integration Test untuk Data Access Layer
 ┃ ┃   ┣ 📂 components
 ┃ ┃   ┃ ┣ 📜 order-form.tsx
 ┃ ┃   ┃ ┗ 📜 order-form.test.tsx          # 🧪 Component UI Test (React Testing Library)
 ┃ ┃   ┗ 📂 schemas
 ┃ ┃     ┣ 📜 order-schema.ts
 ┃ ┃     ┗ 📜 order-schema.test.ts         # 🧪 Unit Test validasi skema Zod & boundary
 ┃ ┃
 ┃ ┗ 📂 lib
 ┃   ┣ 📜 utils.ts
 ┃   ┗ 📜 utils.test.ts                    # 🧪 Unit Test fungsi utilitas murni
 ┃
 ┣ 📂 tests                                # 🌐 FOLDER PENGUJIAN GLOBAL & E2E
 ┃ ┣ 📂 setup
 ┃ ┃ ┣ 📜 vitest.setup.ts                  # Konfigurasi global Vitest, matcher jest-dom, & reset mock
 ┃ ┃ ┗ 📜 auth.setup.ts                    # Setup sesi login otomatis untuk Playwright
 ┃ ┣ 📂 factories                          # Pembuat data dummy dinamis (Test Data Builders)
 ┃ ┃ ┣ 📜 user.factory.ts
 ┃ ┃ ┣ 📜 product.factory.ts
 ┃ ┃ ┗ 📜 order.factory.ts
 ┃ ┣ 📂 mocks                              # Mock global (Database client, Next.js navigation/cache, MSW)
 ┃ ┃ ┣ 📜 db.mock.ts
 ┃ ┃ ┗ 📜 handlers.ts                      # MSW handlers untuk simulasi API pihak ketiga
 ┃ ┗ 📂 e2e                                # 🎭 End-to-End Testing (Playwright)
 ┃   ┣ 📂 auth
 ┃   ┃ ┗ 📜 login.spec.ts
 ┃   ┗ 📂 orders
 ┃     ┗ 📜 checkout-flow.spec.ts
 ┣ 📜 vitest.config.ts
 ┗ 📜 playwright.config.ts
```

### Aturan Penamaan File Pengujian
- **Unit & Integration Test (Non-JSX):** `[nama-file-asli].test.ts`
- **Component UI Test (React JSX):** `[nama-komponen].test.tsx`
- **End-to-End Test (Playwright):** `[nama-alur-fitur].spec.ts` (di dalam `tests/e2e/`)

---

## 2. Strategi 5 Lapisan Pengujian (The Testing Trophy)

AI Agent wajib memastikan setiap fitur baru terlindungi oleh 5 lapisan pengujian berikut sesuai jenis file yang dibuat:

### Lapis 1: Static Analysis & Type Check (Gerbang Pertama)
- Sebelum menjalankan *test runner*, kode harus bebas dari kesalahan tipe TypeScript (`npx tsc --noEmit`) dan aturan linter (`npm run lint`).
- **Dilarang keras** menggunakan `@ts-ignore`, `@ts-expect-error`, atau tipe `any` di dalam file `.test.ts` hanya untuk memaksa pengujian berjalan. Gunakan `Partial<T>` atau *Test Factory* yang bertipe lengkap.

### Lapis 2: Unit Testing (Fungsi Murni, Kalkulasi Bisnis, & Skema Zod)
- **Target:** Semua file di `src/lib/`, `src/features/*/schemas/`, dan fungsi perhitungan bisnis (harga, pajak, diskon, stok, konversi satuan).
- **Kewajiban Skenario:**
  1. Nilai normal (*Happy Path*).
  2. Nilai batas (*Boundary Values*: angka `0`, angka negatif `-1`, nilai maksimum, array kosong `[]`).
  3. Nilai tidak valid: string kosong `""`, string hanya berisi spasi `"   "`, format email/UUID salah, tipe data salah.

### Lapis 3: Integration Testing (Server Actions & Data Access Layer / `queries/`)
- **Target:** Semua file di `src/features/*/actions/` dan `src/features/*/queries/`.
- **5 Skenario Wajib untuk Setiap Server Action:**
  1. **Unauthenticated & Unauthorized (RBAC):** Harus menolak akses (`success: false`) jika pengguna belum login atau memiliki `role` yang tidak diizinkan.
  2. **Anti-IDOR (Kepemilikan Data):** Harus menolak akses jika pengguna A mencoba mengubah/menghapus data milik pengguna B.
  3. **Invalid Input (Zod Failure):** Harus mengembalikan `success: false` beserta objek `fieldErrors` yang akurat tanpa menyentuh database.
  4. **Business Logic & Concurrency Failure:** Harus gagal dengan pesan terukur jika aturan bisnis dilanggar (misal: stok produk habis, kupon kedaluwarsa, atau transaksi database gagal di tengah jalan sehingga terjadi *rollback*).
  5. **Happy Path & Side Effects:** Harus berhasil menyimpan data dengan nilai yang dihitung di server (bukan harga dari *client*), mencatat *Audit Log* (bila sensitif), dan memanggil `revalidatePath()`.
- **Skenario Wajib untuk `queries/`:**
  1. Memastikan data yang sudah terkena *Soft Delete* (`deletedAt !== null`) **tidak pernah** ikut terambil.
  2. Memastikan batas paginasi (`take` dan `skip`) berjalan akurat dan tidak mengizinkan `pageSize` melebihi batas maksimal server.

### Lapis 4: Component & UI Testing (React Testing Library)
- **Target:** Komponen interaktif di `src/features/*/components/` (khususnya Form, Modal Konfirmasi, Filter Tabel).
- **Aturan Prioritas Selector (Aksesibilitas Utama):**
  - **Prioritas 1:** `screen.getByRole('button', { name: /simpan/i })`, `screen.getByLabelText(/nama produk/i)`
  - **Prioritas 2:** `screen.getByPlaceholderText(...)`, `screen.getByText(...)`
  - **Hindari:** `screen.getByTestId(...)` kecuali elemen benar-benar tidak memiliki peran semantik atau teks.
- **Gunakan `userEvent`:** Selalu gunakan `const user = userEvent.setup()` dari `@testing-library/user-event` (bukan `fireEvent`) agar simulasi ketikan dan klik menyerupai interaksi manusia nyata di browser.

### Lapis 5: End-to-End (E2E) Testing (Playwright)
- **Target:** Alur utama dari ujung ke ujung (*Critical User Journey*) di dalam `tests/e2e/`.
- Menguji integrasi halaman sesungguhnya di browser, perpindahan URL (`searchParams`), penyimpanan database nyata (pada database test), dan tampilan notifikasi *Toast*.

---

## 3. Prinsip Best Practice Penulisan Kode Pengujian

### 3.1 Struktur Pola AAA (Arrange - Act - Assert)
Setiap blok `it()` atau `test()` wajib dipisahkan secara visual menjadi tiga bagian:
- **Arrange (Persiapan):** Siapkan data *factory*, atur kondisi *mock* (misal sesi user dan respons DB).
- **Act (Eksekusi):** Panggil satu fungsi/action atau lakukan interaksi pengguna pada komponen.
- **Assert (Verifikasi):** Periksa nilai kembalian (*return value*), perubahan state/DOM, dan pemanggilan fungsi efek samping (`expect(...).toHaveBeenCalledWith(...)`).

### 3.2 Penamaan Test yang Deskriptif (Behaviour-Driven Naming)
Jangan menulis nama test yang abstrak seperti `it("works")` atau `it("test error")`. Gunakan pola kalimat:
- Bahasa Indonesia: `it("harus menolak pembuatan pesanan ketika stok produk tidak mencukupi")`
- Bahasa Inggris: `it("should reject order creation when product stock is insufficient")`

### 3.3 Gunakan Test Data Factory (Larangan Hardcode Berulang)
Jangan menyalin objek JSON raksasa di setiap file test. Buat fungsi pembangun (*Factory Pattern*) di `tests/factories/` sehingga setiap test hanya perlu mengisi properti yang relevan dengan skenario yang sedang diuji:

```typescript
// tests/factories/product.factory.ts
import { Product } from "@prisma/client";

export function buildMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod-default-123",
    sku: "SKU-001",
    name: "Produk Standar Uji",
    price: 50000,
    stock: 10,
    isActive: true,
    deletedAt: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}
```

### 3.4 Aturan Isolasi & Kebersihan Mock
- Setiap test harus **100% independen** (urutan eksekusi acak tidak boleh membuat test gagal).
- Wajib memanggil `vi.clearAllMocks()` di dalam `beforeEach()` atau mengaktifkan `clearMocks: true` pada `vitest.config.ts`.
- **Jangan memalsukan (Mock) kode yang sedang diuji.** Jika menguji `createOrder`, Anda hanya boleh melakukan *mock* pada dependensi eksternalnya (`@/lib/db`, `@/lib/auth`, `next/cache`), bukan memalsukan logika internal `createOrder` itu sendiri.

---

## 4. Konfigurasi & Template Kode Standar (Blueprints)

AI Agent wajib mengacu pada template di bawah ini saat menyiapkan infrastruktur pengujian maupun saat menulis file test baru.

### 4.1 Konfigurasi `vitest.config.ts` & Setup Global

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/features/**/*.{ts,tsx}", "src/lib/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/features/**/types/**",
        "src/features/**/constants/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```typescript
// tests/setup/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock untuk modul server-only agar tidak error saat diimpor di lingkungan test
vi.mock("server-only", () => ({}));

// Mock standar untuk Next.js Cache & Navigation
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));
```

### 4.2 Template 1: Unit Test Skema Validasi Zod (`*.schema.test.ts`)

```typescript
// src/features/orders/schemas/order-schema.test.ts
import { describe, it, expect } from "vitest";
import { CreateOrderSchema } from "./order-schema";

describe("CreateOrderSchema Validation", () => {
  it("harus meluluskan payload pesanan yang valid", () => {
    // Arrange
    const validPayload = {
      paymentMethod: "VIRTUAL_ACCOUNT",
      items: [{ productId: "550e8400-e29b-41d4-a716-446655440000", quantity: 2 }],
    };

    // Act
    const result = CreateOrderSchema.safeParse(validPayload);

    // Assert
    expect(result.success).toBe(true);
  });

  it("harus menolak pesanan jika daftar item kosong atau kuantitas <= 0", () => {
    // Arrange
    const invalidPayload = {
      paymentMethod: "VIRTUAL_ACCOUNT",
      items: [{ productId: "550e8400-e29b-41d4-a716-446655440000", quantity: 0 }],
    };

    // Act
    const result = CreateOrderSchema.safeParse(invalidPayload);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.items).toBeDefined();
    }
  });
});
```

### 4.3 Template 2: Integration Test Server Action (`*.action.test.ts`)

```typescript
// src/features/orders/actions/create-order.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";
import { createOrder } from "./create-order";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { buildMockProduct } from "../../../../tests/factories/product.factory";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    $transaction: vi.fn(),
  },
}));

describe("createOrder Server Action", () => {
  const validInput = {
    paymentMethod: "VIRTUAL_ACCOUNT",
    items: [{ productId: "550e8400-e29b-41d4-a716-446655440000", quantity: 2 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. [RBAC] harus menolak akses jika pengguna belum login", async () => {
    // Arrange
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    // Act
    const response = await createOrder(validInput);

    // Assert
    expect(response.success).toBe(false);
    expect(response.message).toMatch(/akses ditolak/i);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("2. [ZOD] harus mengembalikan fieldErrors jika input tidak valid", async () => {
    // Arrange
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "user-1", role: "CUSTOMER" });

    // Act
    const response = await createOrder({ paymentMethod: "INVALID", items: [] });

    // Assert
    expect(response.success).toBe(false);
    expect(response.fieldErrors).toBeDefined();
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("3. [BUSINESS RULE] harus membatalkan transaksi jika stok produk tidak mencukupi", async () => {
    // Arrange
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "user-1", role: "CUSTOMER" });
    const mockProduct = buildMockProduct({
      id: "550e8400-e29b-41d4-a716-446655440000",
      price: 25000,
      stock: 1,
    });

    vi.mocked(db.$transaction).mockImplementationOnce(async (callback) => {
      const mockTx = {
        product: {
          findMany: vi.fn().mockResolvedValue([mockProduct]),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }), // Simulasi gagal potong stok
        },
        order: { create: vi.fn() },
      };
      return callback(mockTx as unknown as Parameters<typeof callback>[0]);
    });

    // Act
    const response = await createOrder(validInput);

    // Assert
    expect(response.success).toBe(false);
    expect(response.message).toMatch(/stok.*tidak mencukupi/i);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("4. [HAPPY PATH] harus berhasil membuat pesanan dengan harga server dan me-revalidate cache", async () => {
    // Arrange
    vi.mocked(getCurrentUser).mockResolvedValueOnce({ id: "user-1", role: "CUSTOMER" });
    const mockProduct = buildMockProduct({
      id: "550e8400-e29b-41d4-a716-446655440000",
      price: 50000,
      stock: 10,
    });
    const mockOrderCreate = vi.fn().mockResolvedValue({ id: "order-999" });

    vi.mocked(db.$transaction).mockImplementationOnce(async (callback) => {
      const mockTx = {
        product: {
          findMany: vi.fn().mockResolvedValue([mockProduct]),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        order: { create: mockOrderCreate },
      };
      return callback(mockTx as unknown as Parameters<typeof callback>[0]);
    });

    // Act
    const response = await createOrder(validInput);

    // Assert
    expect(response.success).toBe(true);
    expect(response.data?.id).toBe("order-999");
    // Pastikan grandTotal dihitung dari harga DB (2 * 50.000 = 100.000)
    expect(mockOrderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          grandTotal: 100000,
          customerId: "user-1",
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/orders");
  });
});
```

### 4.4 Template 3: Component UI & Form Test (`*.test.tsx`)

```tsx
// src/features/products/components/product-form.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProductForm } from "./product-form";

describe("ProductForm Component", () => {
  it("harus menampilkan pesan error validasi jika form dikirim dalam keadaan kosong", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<ProductForm onSubmitAction="{mockOnSubmit}"/>);

    // Act
    await user.click(screen.getByRole("button", { name: /simpan produk/i }));

    // Assert
    expect(await screen.findByText(/nama produk wajib diisi/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("harus menonaktifkan tombol submit saat proses pengiriman sedang berlangsung (mencegah double submit)", async () => {
    // Arrange
    const user = userEvent.setup();
    const slowSubmit = vi.fn(
      () => new Promise<{ success: boolean; message: string }>((resolve) =>
        setTimeout(() => resolve({ success: true, message: "Berhasil" }), 200)
      )
    );
    render(<ProductForm onSubmitAction="{slowSubmit}"/>);

    // Act
    await user.type(screen.getByLabelText(/nama produk/i), "Kopi Arabika");
    await user.type(screen.getByLabelText(/harga/i), "75000");
    const submitButton = screen.getByRole("button", { name: /simpan produk/i });
    await user.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(slowSubmit).toHaveBeenCalledTimes(1);
  });
});
```

### 4.5 Template 4: End-to-End (E2E) Test dengan Playwright (`*.spec.ts`)

```typescript
// tests/e2e/orders/checkout-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Alur Checkout Pesanan (Critical User Journey)", () => {
  test("pengguna dapat memilih produk, melakukan checkout, dan melihat halaman invoice", async ({ page }) => {
    // 1. Buka katalog produk
    await page.goto("/products");

    // 2. Tambah produk ke keranjang
    await page.getByRole("button", { name: /tambah ke keranjang/i }).first().click();

    // 3. Buka halaman checkout dan pilih metode pembayaran
    await page.goto("/orders/checkout");
    await page.getByLabel(/metode pembayaran/i).click();
    await page.getByRole("option", { name: /virtual account/i }).click();

    // 4. Kirim pesanan & pastikan tombol terkunci selama proses
    const payButton = page.getByRole("button", { name: /buat pesanan/i });
    await payButton.click();

    // 5. Verifikasi redirect ke halaman detail pesanan & status PENDING_PAYMENT
    await expect(page).toHaveURL(/\/orders\/[a-zA-Z0-9-]+/);
    await expect(page.getByText(/menunggu pembayaran/i)).toBeVisible();
  });
});
```

---

## 5. Matriks Skenario Wajib Uji (Edge Cases & Security Checklist)

Setiap kali AI Agent menulis unit atau integration test, AI Agent **wajib** menyertakan pengujian untuk celah-celah berikut:

| Kategori Risiko | Skenario Uji Wajib (Test Case) | Ekspektasi Hasil (Assertion) |
| :--- | :--- | :--- |
| **Manipulasi Harga / Diskon** | Client mengirim payload harga negatif atau diskon `150%`. | Ditolak oleh Zod atau diabaikan karena server mengambil harga asli dari DB. |
| **Stok & Kuota Minus (*Race Condition*)** | Kuantitas pembelian melebihi sisa stok saat transaksi berlangsung. | Transaksi dibatalkan (*rollback*), mengembalikan pesan stok tidak cukup. |
| **Akses Lintas Akun (*IDOR*)** | User biasa mencoba memanggil `delete/update` menggunakan ID data milik user lain. | Query gagal menemukan data (`count: 0` / `403 Forbidden`), data user lain tetap utuh. |
| **Kebocoran Data *Soft Delete*** | Mengambil daftar data (`getProducts`) setelah salah satu item dihapus (`deletedAt` terisi). | Item yang sudah dihapus tidak pernah muncul di dalam array hasil query. |
| **Webhook Ganda (*Idempotency*)** | Webhook pembayaran dengan `transactionId` yang sama dikirim 2 kali berturut-turut. | Panggilan kedua langsung mengembalikan `200 OK` tanpa memotong stok atau menambah saldo dua kali. |
| **Input String Ekstrem** | Pengguna memasukkan spasi kosong `"    "` atau karakter berbahaya `<script>alert(1)</script>`. | Ditolak oleh `.trim().min(1)` pada Zod atau dibersihkan dengan aman. |
| **Ketidakakuratan Desimal Uang** | Perhitungan PPN 11% atau diskon persentase menghasilkan angka koma panjang. | Dibulatkan secara konsisten dengan `Math.round()` / `Decimal` tanpa selisih 1 Rupiah. |

---

## 6. Standar Script `package.json` & Otomatisasi CI/CD

AI Agent wajib memastikan script berikut tersedia di dalam `package.json` proyek:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "verify": "npm run typecheck && npm run lint && npm run test:run"
  }
}
```

> **Perintah Verifikasi Tunggal (`npm run verify`):**  
> Sebelum AI Agent menyatakan pekerjaan selesai atau sebelum melakukan `git commit`, jalankan `npm run verify`. Jika ada satu saja tahap yang gagal, dilarang melanjutkan sebelum memperbaikinya.

---

## 7. Format Laporan Pengujian AI Agent (Wajib Dicantumkan di Akhir Tugas)

Setiap kali selesai mengerjakan fitur atau perbaikan kode, AI Agent **wajib** menutup responsnya dengan tabel ringkasan pengujian seperti format di bawah ini:

```markdown
### ✅ Laporan Verifikasi & Pengujian Otomatis
| Lapisan Pengujian | File Pengujian | Skenario Diuji | Status |
| :--- | :--- | :--- | :--- |
| **Typecheck & Lint** | Seluruh Proyek (`tsc --noEmit`) | Konsistensi Tipe & Aturan Impor | 🟢 PASS |
| **Unit Test (Zod/Utils)** | `order-schema.test.ts` | Valid payload, kuantitas 0, string kosong | 🟢 PASS (4/4) |
| **Integration (Actions/DAL)** | `create-order.test.ts` | RBAC, Anti-IDOR, Stok Habis, Happy Path | 🟢 PASS (5/5) |
| **Component UI Test** | `order-form.test.tsx` | Validasi form kosong, Anti Double-Submit | 🟢 PASS (2/2) |
```