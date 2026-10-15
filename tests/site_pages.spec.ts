import { test, expect } from '@playwright/test';

test.describe('HistoricalBible.com — Public Site Pages (Home, Bible, Contact)', () => {
  
  test('REG-09: Home page renders hero, mission pillars, and navigation links', async ({ page }) => {
    await page.goto('/');

    // Assert Brand Title & Logo
    const brand = page.locator('.brand-text');
    await expect(brand).toHaveText('Historical Bible');

    // Assert Main Hero Headline
    const heroH1 = page.locator('section.hero h1');
    await expect(heroH1).toContainText('Connecting the Historicity of the Bible to World History');

    // Assert Mission Pillars
    const pillars = page.locator('section.pillars .card');
    await expect(pillars).toHaveCount(2);
    await expect(pillars.nth(0)).toContainText('Why We Are Here');
    await expect(pillars.nth(1)).toContainText('What We Believe');

    // Assert Navigation Links
    await expect(page.locator('nav.main-nav a[href="/interact.html"]').first()).toBeVisible();
    await expect(page.locator('nav.main-nav a[href="/bible.html"]').first()).toBeVisible();
    await expect(page.locator('nav.main-nav a[href="/contact.html"]').first()).toBeVisible();

    // Assert Scripture Anchor in Footer
    const footer = page.locator('footer.site-footer');
    await expect(footer).toContainText('John 17:3');
    await expect(footer).toContainText('Est. 2019');
  });

  test('REG-10: Bible download page provides verified direct link to Bible.pdf', async ({ page }) => {
    await page.goto('/bible.html');

    // Assert Page Heading
    const h1 = page.locator('.page-header h1');
    await expect(h1).toHaveText('Download the Bible');

    // Assert Direct Download Link
    const downloadBtn = page.locator('a.btn-download');
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toHaveAttribute('href', '/Bible.pdf');
    await expect(downloadBtn).toHaveAttribute('download', 'HistoricalBible-KJV.pdf');

    // Assert Textual Integrity Features
    const features = page.locator('.features-list .feature-item');
    await expect(features).toHaveCount(4);
    await expect(features.nth(0)).toContainText('Translator Additions Preserved [...]');
    await expect(features.nth(1)).toContainText('Covenant Divine Name (LORD)');
    await expect(features.nth(2)).toContainText('Unbreakable Verse Delimiters {c:v}');
  });

  test('REG-11: Contact page renders interactive form and provides submission confirmation', async ({ page }) => {
    await page.goto('/contact.html');

    // Assert Page Title
    const h1 = page.locator('.page-header h1');
    await expect(h1).toHaveText('Contact Me');

    // Fill contact form
    await page.fill('#contact-name', 'John Tester');
    await page.fill('#contact-email', 'tester@example.com');
    await page.fill('#contact-subject', 'Inquiry regarding historical timelines');
    await page.fill('#contact-message', 'Thank you for connecting the historicity of scripture to world history.');

    // Submit form
    await page.click('button[type="submit"]');

    // Assert success alert is visible and form is submitted
    const successAlert = page.locator('#contact-success');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('Message Sent!');
  });
});
