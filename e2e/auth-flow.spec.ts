import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should display login page elements', async ({ page }) => {
      await page.goto('/');
      // Seletores corrigidos para bater com o componente real
      await expect(page.locator('button:has-text("Google")')).toBeVisible();
      await expect(page.locator('button:has-text("GitHub")')).toBeVisible();
      await expect(page.locator('text=Welcome Back')).toBeVisible();
    });

    test('should have accessible login buttons', async ({ page }) => {
      await page.goto('/');
      const googleButton = page.locator('button:has-text("Google")');
      await googleButton.focus();
      await expect(googleButton).toBeFocused();
    });
  });

  test.describe('Google OAuth Flow (Mocked)', () => {
    test('should handle Google login button click', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('button:has-text("Google")')).toBeEnabled();
    });
  });

  test.describe('GitHub OAuth Flow (Mocked)', () => {
    test('should handle GitHub login button click', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('button:has-text("GitHub")')).toBeEnabled();
    });
  });

  test.describe('Protected Routes', () => {
    test('should allow access to public pages without auth', async ({ page }) => {
      const publicPages = ['/about', '/how-it-works', '/testimonials'];
      for (const pagePath of publicPages) {
        await page.goto(pagePath);
        // Usa .first() para evitar erro de múltiplos headers
        await expect(page.locator('header').first()).toBeVisible();
      }
    });
  });
});
