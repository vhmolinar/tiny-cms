import { test, expect } from '@playwright/test';

test.describe('Tiny CMS Smoke Tests', () => {
  
  test('should login and navigate to dashboard', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign in to Tiny CMS/i })).toBeVisible();

    // 2. Fill credentials (created by global-setup)
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 3. Verify successful navigation to Dashboard Overview
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('All systems go')).toBeVisible();
  });

  test('sidebar navigation should work', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

    // Navigate to Posts
    await page.click('a:has-text("Posts")');
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    await expect(page.getByText('Posts management coming soon...')).toBeVisible();

    // Navigate back to Dashboard
    await page.click('a:has-text("Dashboard")');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('publish site function should execute successfully', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

    // Click Publish
    const publishBtn = page.getByRole('button', { name: /Publish Site/i });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    // Wait for the success message (meaning the HTTP Cloud Function returned successfully)
    const messageContainer = page.locator('.mb-6.p-4');
    await expect(messageContainer).toBeVisible({ timeout: 10000 });
    const text = await messageContainer.textContent();
    console.log("PUBLISH RESULT MESSAGE: ", text);
    expect(text).toContain('Site published successfully!');
  });

});
