import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Verified Routes & Clean Architectural Separation', () => {
  test('Brand artwork loads across main and clean routes, with a real favicon', async ({ page, request }) => {
    const favicon = await request.get('/favicon.ico?v=00.01.08');
    expect(favicon.ok()).toBe(true);
    expect((await favicon.body()).length).toBeGreaterThan(1000);
    for (const route of ['/', '/interact', '/bible', '/bible/', '/contact', '/contact/']) {
      await page.goto(route);
      const headerLogo = page.locator('header .brand-image');
      await expect(headerLogo).toBeVisible();
      await expect(headerLogo).toHaveAttribute('alt', 'Historical Bible — Home');
      await expect(page.locator('header .brand-emblem')).toBeVisible();
      await expect(page.locator('header .brand-text')).toContainText('Historical Bible');
      await expect(page.locator('header .brand-white')).toHaveText('Historical');
      await expect(page.locator('header .brand-gold')).toHaveText('Bible');
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/images/brand/apple-touch-icon.png');
      for (const image of await page.locator('header .brand-image, footer .footer-brand img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty('complete', true);
        expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      }
    }
    await page.goto('/');
    await expect(page.locator('.home-brand-art')).toHaveJSProperty('complete', true);
    expect(await page.locator('.home-brand-art').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  });

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

    // Full Study Desk declaration quote
    await expect(page.locator('.declaration-quote')).toContainText('This is not a Bible website. This is the study desk where the Word and the historical record finally sit in the same room.');

    // Mission & PayPal stewardship preserved verbatim with PURPOSE & CONVICTION gold headers (no numbers)
    await expect(page.locator('#mission-title')).toHaveText('Connecting the historicity of the Bible to world history: Historical Bible');
    await expect(page.locator('.mission-grid .mission-card .eyebrow').nth(0)).toHaveText('PURPOSE');
    await expect(page.locator('.mission-grid .mission-card .eyebrow').nth(1)).toHaveText('CONVICTION');
    await expect(page.locator('.mission-card').nth(0)).toContainText("Are you struggling to correlate the peoples and timelines of the Bible to your known world history?");
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
    await expect(page).toHaveTitle(/Historical\s*Bible/);

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

  test('Bible page renders live Scripture Reader with book/chapter navigation and printable PDF edition', async ({ page }) => {
    await page.goto('/bible');
    const reader = page.locator('#live-bible-reader');
    await expect(reader).toBeVisible();

    // Study Desk Slogan Header (matches user vision)
    const sloganHeading = page.locator('.bible-desk-slogan');
    await expect(sloganHeading).toBeVisible();
    await expect(sloganHeading).toHaveText('The study desk where the Word and the historical record finally sit in the same room.');

    // 66 Books across Old and New Testaments
    const bookOptions = page.locator('#reader-book-select option');
    await expect(bookOptions).toHaveCount(66);

    // Initial load defaults to Genesis 1 (31 verses)
    await expect(page.locator('#reader-chapter-title')).toHaveText('GENESIS');
    await expect(page.locator('#reader-chapter-subtitle')).toHaveText('Chapter 1');
    const verses = page.locator('.bible-verse-row');
    await expect(verses).toHaveCount(31);
    await expect(verses.first().locator('.verse-anchor')).toHaveText('{1:1}');
    await expect(verses.first().locator('.verse-text')).toContainText('In the beginning God created');

    // Dual Chronology Banner renders both Event Date and Composition Date
    const chronoBanner = page.locator('#reader-chronology-banner');
    await expect(chronoBanner).toBeVisible();
    await expect(chronoBanner.locator('.chrono-pill-event')).toContainText('Happened:');
    await expect(chronoBanner.locator('.chrono-pill-written')).toContainText('Written:');

    // Chronology sort order switcher
    const sortSelect = page.locator('#reader-sort-select');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('event');
    await expect(page.locator('#reader-order-eyebrow')).toContainText('EVENT CHRONOLOGY');
    await sortSelect.selectOption('written');
    await expect(page.locator('#reader-order-eyebrow')).toContainText('COMPOSITION CHRONOLOGY');
    await sortSelect.selectOption('canonical');
    await expect(page.locator('#reader-order-eyebrow')).toContainText('CANONICAL SCRIPTURE');

    // Click Next Chapter advances to Genesis 2
    await page.locator('#reader-next-btn').click();
    await expect(page.locator('#reader-chapter-subtitle')).toHaveText('Chapter 2');
    await expect(page.locator('.bible-verse-row')).toHaveCount(25);
    await expect(page).toHaveURL(/book=Genesis&chapter=2/);

    // 16:10 Split-Screen layout and sticky toolbar
    await expect(page.locator('.bible-split-layout')).toBeVisible();
    await expect(page.locator('.bible-sticky-toolbar')).toBeVisible();
    await expect(page.locator('#bible-companion-pane')).toBeVisible();

    // In-place verse selection populates companion panel without navigating away
    await page.locator('.bible-verse-row[data-verse="3"]').click();
    await expect(page.locator('.bible-verse-row[data-verse="3"]')).toHaveClass(/active-verse/);
    await expect(page.locator('#companion-tab-xrefs-content .companion-verse-ref')).toContainText('GENESIS {2:3}');
    await expect(page.locator('#companion-tab-xrefs-content .companion-xrefs-list')).toBeVisible();

    // Word-for-word inspection: clicking any word activates Word Inspector in companion panel
    const firstWord = page.locator('.bible-verse-row[data-verse="3"] .kjv-word').first();
    const wordText = await firstWord.getAttribute('data-word');
    await firstWord.click();
    await expect(page.locator('#companion-tab-word-btn')).toHaveClass(/active/);
    await expect(page.locator('.word-inspect-name')).toHaveText(new RegExp(wordText || 'and', 'i'));
    await expect(page.locator('.concordance-verses-list')).toBeVisible();

    // Right-click word context dive works seamlessly
    const seventhWord = page.locator('.bible-verse-row[data-verse="2"] .kjv-word[data-word="seventh"]').first();
    await seventhWord.click({ button: 'right' });
    await expect(page.locator('.word-inspect-name')).toHaveText(/seventh/i);

    // Chronology & Eras companion tab
    await page.locator('#companion-tab-chrono-btn').click();
    const chronoTab = page.locator('#companion-tab-chrono-content');
    await expect(chronoTab).toBeVisible();
    await expect(chronoTab.locator('.event-section')).toContainText('EVENT CHRONOLOGY');
    await expect(chronoTab.locator('.written-section')).toContainText('COMPOSITION CHRONOLOGY');

    // Right-hand companion panel strictly houses study exploration tabs, NOT a PDF tab
    await expect(page.locator('#companion-tab-pdf-btn')).toHaveCount(0);
    const navButtons = page.locator('.companion-tabs-nav button');
    await expect(navButtons).toHaveCount(4);
    await expect(navButtons.nth(0)).toHaveText('Chronology');
    await expect(navButtons.nth(1)).toHaveText('Map');
    await expect(navButtons.nth(2)).toHaveText('Word Inspector');
    await expect(navButtons.nth(3)).toHaveText('Passage & X-Refs');

    // Printable PDF edition is located at the bottom of the page
    const printableCard = page.locator('#printable-edition');
    await expect(printableCard).toBeVisible();
    await expect(printableCard.locator('.printable-seal-badge, .archival-seal-badge')).toContainText('COMPLETE PRINT EDITION');
    await expect(printableCard.locator('.printable-disclaimer-callout, .archival-disclaimer-callout')).toContainText('This downloadable file is a static, printable PDF document');

    // Ensure "archival" or "archive" term is not displayed in the reader or printable card
    const readerText = await page.locator('#live-bible-reader').innerText();
    expect(readerText.toLowerCase()).not.toContain('archival');
    // Header height check and sticky scroll collision guard
    const header = page.locator('.site-header');
    const headerBoxBefore = await header.boundingBox();
    expect(headerBoxBefore).not.toBeNull();
    // Header must be compact (less than or equal to 65px tall)
    expect(headerBoxBefore!.height).toBeLessThanOrEqual(65);

    // Scroll down into the chapter to verify sticky collision offset
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(200);

    const headerBoxAfter = await header.boundingBox();
    const toolbarBoxAfter = await page.locator('.bible-sticky-toolbar').boundingBox();
    const companionBoxAfter = await page.locator('#bible-companion-pane').boundingBox();

    expect(headerBoxAfter).not.toBeNull();
    expect(toolbarBoxAfter).not.toBeNull();
    expect(companionBoxAfter).not.toBeNull();

    // Toolbar and Companion Pane must sit completely below the sticky header (zero hidden controls)
    expect(toolbarBoxAfter!.y).toBeGreaterThanOrEqual(headerBoxAfter!.y + headerBoxAfter!.height);
    expect(companionBoxAfter!.y).toBeGreaterThanOrEqual(headerBoxAfter!.y + headerBoxAfter!.height);

    // Verify all primary controls inside the sticky toolbar remain fully visible in viewport
    await expect(page.locator('#reader-sort-select')).toBeVisible();
    await expect(page.locator('#reader-book-select')).toBeVisible();
    await expect(page.locator('#reader-chapter-select')).toBeVisible();
    await expect(page.locator('#reader-prev-btn')).toBeVisible();
    await expect(page.locator('#reader-next-btn')).toBeVisible();
    await expect(page.locator('#companion-tab-word-btn')).toBeVisible();

    await page.screenshot({ path: 'test-results/live_bible_reader_scrolled_sticky.png' });
    await page.screenshot({ path: 'test-results/live_bible_reader_split.png', fullPage: true });
  });


  test('Interact introduces its searchable collection without duplicating the Home welcome', async ({ page }) => {
    await page.goto('/interact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Historical\s*Bible/);
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
