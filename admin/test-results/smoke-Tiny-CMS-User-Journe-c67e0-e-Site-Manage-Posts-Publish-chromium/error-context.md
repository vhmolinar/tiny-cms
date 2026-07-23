# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Tiny CMS User Journey >> Complete flow: Login, Create Site, Manage Posts, Publish
- Location: e2e/smoke.spec.ts:5:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Site published successfully!"
Received string:    "Site published successfully."
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img [ref=e7]
          - heading "Tiny CMS" [level=1] [ref=e12]
        - generic [ref=e13] [cursor=pointer]:
          - generic [ref=e14]: My Automated Site
          - img [ref=e15]
      - navigation [ref=e17]:
        - link "Dashboard" [ref=e18] [cursor=pointer]:
          - /url: /
          - img [ref=e19]
          - text: Dashboard
        - link "Posts" [ref=e24] [cursor=pointer]:
          - /url: /posts
          - img [ref=e25]
          - text: Posts
      - button "Logout" [ref=e29] [cursor=pointer]:
        - img [ref=e30]
        - text: Logout
    - generic [ref=e33]:
      - banner [ref=e34]:
        - generic [ref=e35]:
          - heading "Overview" [level=2] [ref=e36]
          - generic [ref=e37]:
            - generic [ref=e38]: admin@test.com
            - button "Publish Site" [ref=e39] [cursor=pointer]
      - main [ref=e40]:
        - generic [ref=e41]: Site published successfully.
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - heading "Total Posts" [level=3] [ref=e45]
              - img [ref=e47]
            - paragraph [ref=e50]: "0"
          - generic [ref=e51]:
            - generic [ref=e52]:
              - heading "Status" [level=3] [ref=e53]
              - img [ref=e55]
            - paragraph [ref=e60]: All systems go
  - paragraph [ref=e61]: Running in emulator mode. Do not use with production credentials.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Tiny CMS User Journey', () => {
  4  |   
  5  |   test('Complete flow: Login, Create Site, Manage Posts, Publish', async ({ page }) => {
  6  |     // 1. Visit Login
  7  |     await page.goto('/login');
  8  |     await expect(page.getByRole('heading', { name: /Sign in to Tiny CMS/i })).toBeVisible();
  9  | 
  10 |     // 2. Fill credentials (created by global-setup)
  11 |     await page.fill('input[type="email"]', 'admin@test.com');
  12 |     await page.fill('input[type="password"]', 'password123');
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     // 3. Onboarding: Should redirect to Create Site since user has no sites
  16 |     await expect(page.getByRole('heading', { name: 'Create Your First Site' })).toBeVisible({ timeout: 10000 });
  17 |     await page.fill('input[name="name"]', 'My Automated Site');
  18 |     await page.click('button[type="submit"]');
  19 | 
  20 |     // 4. Dashboard: Should redirect to Overview after creating site
  21 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible({ timeout: 10000 });
  22 |     
  23 |     // Verify the Site Selector shows the new site
  24 |     await expect(page.getByText('My Automated Site')).toBeVisible();
  25 | 
  26 |     // 5. Sidebar Navigation: Posts
  27 |     await page.click('a:has-text("Posts")');
  28 |     await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
  29 | 
  30 |     // 6. Create a new Post
  31 |     await page.click('text=New Post');
  32 |     await expect(page.getByRole('heading', { name: 'Create Post' })).toBeVisible();
  33 | 
  34 |     // Fill Post form
  35 |     await page.fill('input[placeholder="My Awesome Post"]', 'My First Post');
  36 |     await page.fill('input[placeholder="my-awesome-post"]', 'my-first-post');
  37 |     await page.selectOption('select', 'published');
  38 |     await page.fill('textarea', '# Hello World\nThis is the content');
  39 |     
  40 |     // Save Post
  41 |     await page.click('button:has-text("Save Post")');
  42 |     
  43 |     // Should return to Posts list and see the new post
  44 |     await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
  45 |     await expect(page.getByText('My First Post')).toBeVisible();
  46 |     await expect(page.getByText('/my-first-post')).toBeVisible();
  47 | 
  48 |     // 7. Sidebar Navigation: Back to Dashboard
  49 |     await page.click('a:has-text("Dashboard")');
  50 |     await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  51 | 
  52 |     // 8. Publish Site
  53 |     const publishBtn = page.getByRole('button', { name: /Publish Site/i });
  54 |     await expect(publishBtn).toBeVisible();
  55 |     await publishBtn.click();
  56 | 
  57 |     // Wait for the success message (meaning the HTTP Cloud Function returned successfully and processed the Site context)
  58 |     const messageContainer = page.locator('.mb-6.p-4');
  59 |     await expect(messageContainer).toBeVisible({ timeout: 10000 });
  60 |     const text = await messageContainer.textContent();
  61 |     console.log("PUBLISH RESULT MESSAGE: ", text);
> 62 |     expect(text).toContain('Site published successfully!');
     |                  ^ Error: expect(received).toContain(expected) // indexOf
  63 |   });
  64 | 
  65 | });
  66 | 
```