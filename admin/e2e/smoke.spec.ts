import { test, expect } from '@playwright/test';

test.describe('Tiny CMS User Journey', () => {
  
  test('Complete flow: Login, Create Site, Manage Posts, Publish', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign in to Tiny CMS/i })).toBeVisible();

    // 2. Fill credentials (created by global-setup)
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 3. Onboarding: Should redirect to Create Site since user has no sites
    await expect(page.getByRole('heading', { name: 'Create Your First Site' })).toBeVisible({ timeout: 10000 });
    await page.fill('input[name="name"]', 'My Automated Site');
    await page.click('button[type="submit"]');

    // 4. Dashboard: Should redirect to Overview after creating site
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible({ timeout: 10000 });
    
    // Verify the Site Selector shows the new site
    await expect(page.getByText('My Automated Site')).toBeVisible();

    // 5. Sidebar Navigation: Posts
    await page.click('a:has-text("Posts")');
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
    await expect(page.getByText('Posts management coming soon...')).toBeVisible();

    // 6. Sidebar Navigation: Back to Dashboard
    await page.click('a:has-text("Dashboard")');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

    // 7. Publish Site
    const publishBtn = page.getByRole('button', { name: /Publish Site/i });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    // Wait for the success message (meaning the HTTP Cloud Function returned successfully and processed the Site context)
    const messageContainer = page.locator('.mb-6.p-4');
    await expect(messageContainer).toBeVisible({ timeout: 10000 });
    const text = await messageContainer.textContent();
    console.log("PUBLISH RESULT MESSAGE: ", text);
    expect(text).toContain('Site published successfully!');
  });

});
