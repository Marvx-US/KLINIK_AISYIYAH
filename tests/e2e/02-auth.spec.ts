import { test, expect } from '@playwright/test';

test.describe('Authentication & Protected Route Flow (Bab 12.1 E2E Testing)', () => {
  test('should redirect unauthorized user away from admin dashboard to login', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('should handle authentication lifecycle: validate form, reject invalid credentials, and login successfully', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');

    // 1. Verifikasi form render
    await page.waitForSelector('#username');
    await expect(page.locator('h2')).toContainText(/Masuk ke Portal Admin/i);
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 2. Coba kredensial salah
    await page.fill('#username', 'invalid_user');
    await page.fill('#password', 'wrong_password_123');
    await page.click('button[type="submit"]');

    // Verifikasi alert error muncul
    const alertBox = page.locator('div.bg-red-50');
    await expect(alertBox).toBeVisible({ timeout: 15000 });
    await expect(alertBox).toContainText(/salah/i);

    // 3. Masukkan kredensial admin yang benar
    await page.fill('#username', 'aisyiyah@admin.com');
    await page.fill('#password', 'Aisyiyah25');
    await page.click('button[type="submit"]');

    // Verifikasi navigasi sukses ke dashboard admin
    await expect(page).toHaveURL(/admin/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText(/Selamat Datang di Dashboard Admin/i);
  });
});
