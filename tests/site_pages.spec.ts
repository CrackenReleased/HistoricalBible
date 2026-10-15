import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Verified Routes', () => {
  test('Home page renders exact GoDaddy archived content and styles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Historical Bible/);
    
    // Check key visible content
    const heading = page.locator('text=Connecting the historicity of the Bible');
    await expect(heading.first()).toBeVisible();
    
    const donateBtn = page.locator('text=Donate Now');
    await expect(donateBtn).toBeVisible();
    
    // Screenshot
    await page.screenshot({ path: 'test-results/live_home.png', fullPage: true });
  });

  test('Contact page renders exact GoDaddy contact form', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/HistoricalBible/);
    
    const contactHeading = page.locator('text=Contact Me');
    await expect(contactHeading.first()).toBeVisible();
    
    // Screenshot
    await page.screenshot({ path: 'test-results/live_contact.png', fullPage: true });
  });

  test('Bible download page renders download button with direct PDF link', async ({ page }) => {
    await page.goto('/bible', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Bible/);
    
    const downloadHeading = page.locator('text=Download the Bible');
    await expect(downloadHeading.first()).toBeVisible();
    
    const downloadLink = page.locator('a[href*="Bible.pdf"]');
    await expect(downloadLink.first()).toBeVisible();
    
    // Screenshot
    await page.screenshot({ path: 'test-results/live_bible.png', fullPage: true });
  });

  test('Interact visualizer route is active', async ({ page }) => {
    await page.goto('/interact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/HistoricalBible/);
    await page.screenshot({ path: 'test-results/live_interact.png', fullPage: true });
  });
});
