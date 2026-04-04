import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate through all main pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Community Cares/i);

    // Navigate to About
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1#hero-heading')).toContainText(/about/i);

    // Navigate to How It Works
    await page.click('text=How It Works');
    await expect(page).toHaveURL(/\/how-it-works/);
    await expect(page.locator('h1#main-heading')).toBeVisible();

    // Navigate to Testimonials
    await page.click('text=Testimonials');
    await expect(page).toHaveURL(/\/testimonials/);
    await expect(page.locator('h1#testimonials-hero-heading')).toContainText(/Stories/i);

    // Navigate back to home via logo
    await page.getByRole('link', { name: 'Community Cares', exact: true }).click();
    await expect(page).toHaveURL('/');
  });

  test('should have working logo link on all pages', async ({ page }) => {
    const pages = ['/about', '/how-it-works', '/testimonials'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.getByRole('link', { name: 'Community Cares', exact: true }).click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should display navigation links in header', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('nav >> text=About')).toBeVisible();
    await expect(page.locator('nav >> text=How It Works')).toBeVisible();
    await expect(page.locator('nav >> text=Testimonials')).toBeVisible();
  });

  test('should toggle mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileMenu = page.locator('[role="dialog"][aria-label="Mobile menu"]');
    await expect(mobileMenu).not.toBeVisible();

    const menuButton = page.locator('[aria-label="Toggle menu"]');
    await menuButton.click();

    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.locator('text=About')).toBeVisible();

    await menuButton.click();
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('[aria-label="Toggle menu"]');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobileDialog = page.locator('[role="dialog"]');
    await expect(mobileDialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should handle direct URL access', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1#hero-heading')).toContainText(/about/i);

    await page.goto('/how-it-works');
    await expect(page.locator('h1#main-heading')).toBeVisible();

    await page.goto('/testimonials');
    await expect(page.locator('h1#testimonials-hero-heading')).toBeVisible();
  });

  test('should persist header across all pages', async ({ page }) => {
    const pages = ['/', '/about', '/how-it-works', '/testimonials'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await expect(page.locator('header').first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Community Cares', exact: true })).toBeVisible();
    }
  });
});
