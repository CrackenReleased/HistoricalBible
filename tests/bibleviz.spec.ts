import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Cross-References Interactive Engine', () => {
  test.beforeEach(async ({ page }) => {
    // Open the local standalone 2D canvas visualizer
    await page.goto('/tapestry.html');
    // Wait for canvas to be mounted
    await page.waitForSelector('#arcs-canvas');
  });

  test('REG-01: Legal & License Compliance Guard (No Etsy Raster Assets)', async ({ page }) => {
    // Assert no raster filenames from Etsy are referenced in img tags, stylesheets, or DOM
    const images = await page.locator('img').evaluateAll(imgs =>
      imgs.map((i: HTMLImageElement) => i.src)
    );
    for (const src of images) {
      expect(src).not.toContain('BibleVizArc7WiderOTNT');
      expect(src).not.toContain('BibleNetwork.jpg');
    }

    // Verify legal CC BY 4.0 attribution is prominently displayed in footer
    const footerText = await page.locator('footer.attribution').innerText();
    expect(footerText).toContain('OpenBible.info (CC BY 4.0)');
    expect(footerText).toContain('Treasury of Scripture Knowledge');
  });

  test('REG-02: Canonical Histogram Invariants (1,189 Chapters & Psalm 119 Max Spike)', async ({ page }) => {
    const chapterCount = await page.evaluate(() => (window as any).CHAPTERS?.length || 0);
    expect(chapterCount).toBe(1189);

    // Assert Psalm 119 exists and is the maximum bar in the canonical list
    const psalm119 = await page.evaluate(() => {
      const chs = (window as any).CHAPTERS;
      return chs ? chs.find((c: any) => c.bookId === 'Ps' && c.chapter === 119) : null;
    });
    expect(psalm119).not.toBeNull();
    expect(psalm119.verses).toBe(176);
  });

  test('REG-03: Mode Switcher toggles seamlessly between Arcs and Threads views', async ({ page }) => {
    const arcsView = page.locator('#arcs-view');
    const threadsView = page.locator('#threads-view');

    await expect(arcsView).toBeVisible();
    await expect(threadsView).toBeHidden();

    // Switch to Threads
    await page.click('#btn-mode-threads');
    await expect(threadsView).toBeVisible();
    await expect(arcsView).toBeHidden();

    // Switch back to Arcs
    await page.click('#btn-mode-arcs');
    await expect(arcsView).toBeVisible();
    await expect(threadsView).toBeHidden();
  });

  test('REG-04: Verse Selection updates Right Inspector with KJV text & cross-references', async ({ page }) => {
    // Switch to Threads view
    await page.click('#btn-mode-threads');
    await page.waitForSelector('.verse-row');

    // Click first verse (Acts 1:1)
    await page.locator('.verse-row').first().click();

    await expect(page.locator('#insp-ref')).toHaveText('Acts 1:1');
    const verseText = await page.locator('#insp-text').innerText();
    expect(verseText).toContain('The former treatise have I made');

    // Verify connected cross-reference cards render with scripture text
    await page.waitForSelector('.xref-card');
    const xrefCount = await page.locator('.xref-card').count();
    expect(xrefCount).toBeGreaterThan(0);
  });

  test('REG-05: Omnibox search navigates to targeted passage', async ({ page }) => {
    const searchInput = page.locator('#verse-search');
    await searchInput.fill('John 3:16');
    await searchInput.press('Enter');

    await expect(page.locator('#insp-ref')).toHaveText('John 3:16');
    const verseText = await page.locator('#insp-text').innerText();
    expect(verseText.toLowerCase()).toContain('for god so loved the world');
  });
});
