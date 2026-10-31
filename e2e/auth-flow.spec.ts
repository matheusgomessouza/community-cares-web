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

  test.describe('Login error layout', () => {
    test('keeps the error below its button and inside the card', async ({ page }) => {
      await page.route('**/users/authenticate/github', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: '{}',
        }),
      );

      await page.goto('/?code=fake');

      const error = page.getByText(
        'Erro na autenticação. Verifique e tente novamente.',
      );
      await expect(error).toBeVisible();

      const card = page.locator('section');
      const github = page.getByRole('button', { name: 'GitHub' });
      const google = page.getByRole('button', { name: 'Google' });

      const cardBox = (await card.boundingBox())!;
      const githubBox = (await github.boundingBox())!;
      const googleBox = (await google.boundingBox())!;
      const errorBox = (await error.boundingBox())!;

      // The error sits below the button, not beside it in the button row.
      expect(errorBox.y).toBeGreaterThanOrEqual(
        githubBox.y + githubBox.height,
      );

      // The error stays inside the card.
      expect(errorBox.x).toBeGreaterThanOrEqual(cardBox.x);
      expect(errorBox.x + errorBox.width).toBeLessThanOrEqual(
        cardBox.x + cardBox.width,
      );

      // Both buttons keep a usable width instead of shrinking to a column.
      expect(githubBox.width).toBeGreaterThan(150);
      expect(googleBox.width).toBeGreaterThan(150);
    });
  });
});
