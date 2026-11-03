import { test, expect } from '@playwright/test';

test.describe('Public Pages & Navigation Flow (Bab 12.1 E2E Testing)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('should load the homepage with clinic branding and navigation', async ({ page }) => {
    await page.goto('/');

    // Verifikasi branding klinik
    await expect(page).toHaveTitle(/Klinik Aisyiyah Pangkajene/i);

    // Verifikasi Navbar dan tautan utama
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Verifikasi elemen teks utama di hero section
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should navigate to services page and render medical services', async ({ page }) => {
    await page.goto('/services');

    await expect(page).toHaveTitle(/Layanan Medis/i);
    await expect(page.locator('h1')).toContainText(/Layanan/i);
  });

  test('should navigate to articles page', async ({ page }) => {
    await page.goto('/articles');

    await expect(page).toHaveTitle(/Artikel/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to contact page with address and information', async ({ page }) => {
    await page.goto('/contact');

    await expect(page).toHaveTitle(/Kontak/i);
    await expect(page.locator('h1')).toBeVisible();
  });
});
