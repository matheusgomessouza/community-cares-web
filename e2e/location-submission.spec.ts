import { test, expect } from '@playwright/test';

test.describe('Location Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/location');
  });

  test.describe('Form Display', () => {
    test('should display location submission form', async ({ page }) => {
      await expect(page.locator('h2#form-heading')).toContainText('Share a location');
      
      await expect(page.getByPlaceholder('Establishment name')).toBeVisible();
      await expect(page.locator('select[name="type"]')).toBeVisible();
      await expect(page.getByPlaceholder('Establishment address')).toBeVisible();
      await expect(page.getByPlaceholder('Enter phone number')).toBeVisible();
    });

    test('should display all establishment type options', async ({ page }) => {
      const typeSelect = page.locator('select[name="type"]');
      await expect(typeSelect).toBeVisible();

      await expect(typeSelect.locator('option')).toContainText([
        '-- Please choose an option --',
        'Community kitchen',
        'Solidarity kitchen',
        'Shelter',
        'Hospital',
      ]);
    });

    test('should display map picker', async ({ page }) => {
      await expect(page.locator('label').filter({ hasText: 'Location' }).first()).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      await expect(page.locator('h1#hero-heading')).toContainText('Building communities that care');
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors for empty required fields', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /share/i });
      await submitButton.click();

      await expect(page.getByText('Required field').first()).toBeVisible();
      await expect(page.getByText('Please select a establishment type')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1#hero-heading');
      await expect(h1).toBeVisible();

      const h2 = page.locator('h2#form-heading');
      await expect(h2).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(activeElement).toMatch(/INPUT|SELECT|BUTTON|A/);
    });
  });
});
