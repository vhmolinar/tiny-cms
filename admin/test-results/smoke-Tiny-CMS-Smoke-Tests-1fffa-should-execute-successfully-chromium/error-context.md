# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Tiny CMS Smoke Tests >> publish site function should execute successfully
- Location: e2e/smoke.spec.ts:39:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Overview' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Overview' })

```

```yaml
- heading "Sign in to Tiny CMS" [level=2]
- text: Email address
- textbox: admin@test.com
- text: Password
- textbox: password123
- text: "Firebase: Error (auth/network-request-failed)."
- button "Sign in"
- paragraph: Running in emulator mode. Do not use with production credentials.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Tiny CMS Smoke Tests', () => {
  4  |   
  5  |   test('should login and navigate to dashboard', async ({ page }) => {
  6  |     // 1. Visit Login
  7  |     await page.goto('/login');
  8  |     await expect(page.getByRole('heading', { name: /Sign in to Tiny CMS/i })).toBeVisible();
  9  | 
  10 |     // 2. Fill credentials (created by global-setup)
  11 |     await page.fill('input[type="email"]', 'admin@test.com');
  12 |     await page.fill('input[type="password"]', 'password123');
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     // 3. Verify successful navigation to Dashboard Overview
  16 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  17 |     await expect(page.getByText('All systems go')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('sidebar navigation should work', async ({ page }) => {
  21 |     // Login
  22 |     await page.goto('/login');
  23 |     await page.fill('input[type="email"]', 'admin@test.com');
  24 |     await page.fill('input[type="password"]', 'password123');
  25 |     await page.click('button[type="submit"]');
  26 | 
  27 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  28 | 
  29 |     // Navigate to Posts
  30 |     await page.click('a:has-text("Posts")');
  31 |     await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
  32 |     await expect(page.getByText('Posts management coming soon...')).toBeVisible();
  33 | 
  34 |     // Navigate back to Dashboard
  35 |     await page.click('a:has-text("Dashboard")');
  36 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  37 |   });
  38 | 
  39 |   test('publish site function should execute successfully', async ({ page }) => {
  40 |     // Login
  41 |     await page.goto('/login');
  42 |     await page.fill('input[type="email"]', 'admin@test.com');
  43 |     await page.fill('input[type="password"]', 'password123');
  44 |     await page.click('button[type="submit"]');
> 45 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  46 | 
  47 |     // Click Publish
  48 |     const publishBtn = page.getByRole('button', { name: /Publish Site/i });
  49 |     await expect(publishBtn).toBeVisible();
  50 |     await publishBtn.click();
  51 | 
  52 |     // Wait for the success message (meaning the HTTP Cloud Function returned successfully)
  53 |     const messageContainer = page.locator('.mb-6.p-4');
  54 |     await expect(messageContainer).toBeVisible({ timeout: 10000 });
  55 |     const text = await messageContainer.textContent();
  56 |     console.log("PUBLISH RESULT MESSAGE: ", text);
  57 |     expect(text).toContain('Site published successfully!');
  58 |   });
  59 | 
  60 | });
  61 | 
```