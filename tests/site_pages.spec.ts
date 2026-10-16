import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Verified Routes & Clean Architectural Separation', () => {
  test('Home page (Front Door) renders dark-gold welcome, 4-stop timeline, 3 curiosity doors, mission, and PayPal donation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Historical Bible/);

    // Front Door headline & timeline thread
    await expect(page.getByRole('heading', { name: 'The Bible happened in the real world.' })).toBeVisible();
    await expect(page.locator('.thread-stop')).toHaveCount(4);

    // 3 Curiosity Doors linking into /interact?figure=...
    await expect(page.locator('.entry-card')).toHaveCount(3);
    await expect(page.locator('.entry-card[data-door="hezekiah"]')).toHaveAttribute('href', '/interact?figure=hezekiah');
    await expect(page.locator('.entry-card[data-door="daniel"]')).toHaveAttribute('href', '/interact?figure=daniel');
    await expect(page.locator('.entry-card[data-door="moses"]')).toHaveAttribute('href', '/interact?figure=moses');

    // Mission & PayPal stewardship preserved verbatim with PURPOSE & CONVICTION gold headers (no numbers)
    await expect(page.locator('#mission-title')).toHaveText('Connecting the historicity of the Bible to world history: Historical Bible');
    await expect(page.locator('.mission-grid .mission-card .eyebrow').nth(0)).toHaveText('PURPOSE');
    await expect(page.locator('.mission-grid .mission-card .eyebrow').nth(1)).toHaveText('CONVICTION');
    await expect(page.locator('.mission-card').nth(0)).toContainText("Are you struggling to correlate the people's and timelines of the Bible to your known world history?");
    await expect(page.locator('.mission-card').nth(1)).toContainText('We at Historical Bible believe that the Bible is the inerrant word of God. We believe the Bible literally, and that it is not only historically accurate, but that it is also eschatologically accurate.');

    const donateBtn = page.locator('text=Donate Now');
    await expect(donateBtn).toBeVisible();

    // Quiet footnote for the curious: Why the KJV (in exact order, zero parentheses)
    const kjvFootnote = page.locator('.kjv-footnote');
    await expect(kjvFootnote).toBeVisible();
    await expect(kjvFootnote.locator('#why-kjv-title')).toHaveText('Why the KJV');
    const footnoteItems = kjvFootnote.locator('.kjv-footnote-grid p');
    await expect(footnoteItems).toHaveCount(3);
    await expect(footnoteItems.nth(0)).toContainText('Unchanging Standard:');
    await expect(footnoteItems.nth(1)).toContainText('Doctrinal & Textual Faithfulness:');
    await expect(footnoteItems.nth(2)).toContainText('Translator Honesty:');
    const footnoteText = (await kjvFootnote.textContent()) || '';
    expect(footnoteText).not.toMatch(/[()]/);

    // Welcome Popup Modal (#popup-widget6691) rendered in dark-gold theme
    const popup = page.locator('#popup-widget6691');
    await expect(popup).toBeVisible();
    await expect(popup.locator('.bible-popup-title')).toHaveText('Download the Bible');
    await expect(popup.locator('.bible-popup-desc')).toHaveText('Nothing extra, no frills. Just the KJV');
    await expect(popup.locator('.bible-popup-cta')).toHaveAttribute('href', '/bible');
    await expect(popup.locator('.bible-popup-cta')).toContainText('Take me there');

    await page.screenshot({ path: 'test-results/live_home_popup.png' });
    await page.locator('#popup-widget6691-close-icon').click();
    await expect(popup).toBeHidden();

    await page.screenshot({ path: 'test-results/live_home.png', fullPage: true });
  });

  test('Clicking a Curiosity Door on Home transitions directly to that figure on the Interact Study Desk', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#popup-widget6691-close-icon').click();
    await page.locator('.entry-card[data-door="hezekiah"]').click();
    await expect(page).toHaveURL(/\/interact\?figure=hezekiah/);
    await expect(page.locator('.figure-hero-name')).toContainText('Hezekiah');
    await expect(page.locator('#discovery-evidence')).toContainText('Taylor Prism');
  });

  test('Contact page renders dark-gold contact form and confirmation state', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/HistoricalBible/);

    const contactHeading = page.locator('text=Contact Me');
    await expect(contactHeading.first()).toBeVisible();

    await page.locator('#contact-name').fill('Test Reader');
    await page.locator('#contact-email').fill('reader@example.com');
    await page.locator('#contact-message').fill('Thank you for the historical study desk.');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.locator('#contact-status')).toBeVisible();

    await page.screenshot({ path: 'test-results/live_contact.png', fullPage: true });
  });

  test('Bible download page renders dark-gold download portal with direct PDF link and KJV notation guide', async ({ page }) => {
    await page.goto('/bible', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Bible/);

    const downloadHeading = page.locator('text=Download the Bible');
    await expect(downloadHeading.first()).toBeVisible();

    const downloadLink = page.locator('a[href="/Bible.pdf"]');
    await expect(downloadLink.first()).toBeVisible();
    const divineName = page.locator('.kjv-divine-name').first();
    await expect(divineName).toHaveText('LORD');
    await expect(divineName.locator('.kjv-divine-rest')).toHaveText('ORD');
    const sizes = await divineName.evaluate((el) => {
      const rest = el.querySelector('.kjv-divine-rest')!;
      return {
        full: parseFloat(getComputedStyle(el).fontSize),
        rest: parseFloat(getComputedStyle(rest).fontSize),
      };
    });
    expect(sizes.rest).toBeLessThan(sizes.full * 0.85);

    await page.screenshot({ path: 'test-results/live_bible.png', fullPage: true });
  });

  test('Interact introduces its searchable collection without duplicating the Home welcome', async ({ page }) => {
    await page.goto('/interact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/HistoricalBible/);
    // No duplicate front-door hero or 3 curiosity doors on /interact
    await expect(page.locator('section.intro')).toHaveCount(0);
    await expect(page.locator('section.entry-section')).toHaveCount(0);
    await expect(page.locator('#collection-title')).toContainText('Every passage');
    // The original discovery reader remains available below the collection introduction.
    await expect(page.locator('#discovery')).toBeVisible();
    await page.screenshot({ path: 'test-results/live_interact.png', fullPage: true });
  });

  test('No page contains any "hand-typed" or "hand typed" wording in HTML or visible text, and version stays on v00.01.xx beta sequence', async ({ page }) => {
    for (const route of ['/', '/bible', '/interact', '/contact']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const html = await page.content();
      expect(html).not.toMatch(/hand-typed|hand typed|handtyped/i);
      expect(html).not.toMatch(/Interact\s*·\s*v1\./i);
    }
    await page.goto('/interact', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('footer')).toContainText(/Interact\s*·\s*v00\.01\.\d+/);
  });
});
