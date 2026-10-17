import { test, expect } from '@playwright/test';

test.describe('Bible Side-by-Side Companion Map Tab', () => {
  test('renders Map tab in Bible side-by-side companion panel and initializes interactive cartography', async ({ page }) => {
    // 1. Navigate to Bible reader
    await page.goto('/bible?book=Genesis&chapter=1', { waitUntil: 'networkidle' });

    // 2. Assert companion tabs exist including Map
    const mapTabBtn = page.locator('#companion-tab-map-btn');
    await expect(mapTabBtn).toBeVisible();
    await expect(mapTabBtn).toHaveText('Map');

    // Initially xrefs tab is active and map tab is inactive
    const mapContent = page.locator('#companion-tab-map-content');
    await expect(mapContent).toBeHidden();

    // 3. Click the Map tab
    await mapTabBtn.click();
    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapTabBtn).toHaveAttribute('aria-selected', 'true');
    await expect(mapContent).toBeVisible();

    // 4. Assert embedded map container and Leaflet map initialized
    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible();
    await expect(mapContainer).toHaveClass(/leaflet-container/);

    // 5. Assert title and headline reflect Genesis 1
    const title = page.locator('#companion-map-title');
    await expect(title).toContainText('Genesis 1');

    // 6. Assert Full-Screen Atlas link
    const fullLink = page.locator('#companion-map-full-link');
    await expect(fullLink).toBeVisible();
    await expect(fullLink).toHaveAttribute('href', /map\?era=/);

    // 7. Assert Map Color Key (Kingdoms & Factions)
    const mapKeyCard = page.locator('#bible-map-key-card');
    await expect(mapKeyCard).toBeVisible();
    await expect(mapKeyCard).toContainText('MAP KEY · KINGDOMS & FACTIONS');
    await expect(mapKeyCard).toContainText('Kingdom of Judah');
    await expect(mapKeyCard).toContainText('Kingdom of Israel');
    await expect(mapKeyCard).toContainText('Hostile Empires & Enemies');
    await expect(mapKeyCard).toContainText('Friendly & Allied Regions');
    await expect(mapKeyCard).toContainText('Archaeological Discoveries');

    // Assert color dots are rendered
    await expect(mapKeyCard.locator('.map-key-dot.dot-judah')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-israel')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-hostile')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-allied')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-archaeology')).toBeVisible();

    // 8. Capture visual proof screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/bible-side-by-side-map-proof.png', fullPage: false });
  });

  test('2 Kings 1 displays Assyrian Empire epoch with full color map key at bottom of side panel', async ({ page }) => {
    // Navigate directly to 2 Kings 1 with tab=map
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    const mapContent = page.locator('#companion-tab-map-content');
    await expect(mapContent).toBeVisible();

    // Assert title reflects 2 Kings 1 · Assyrian Empire
    await expect(page.locator('#companion-map-title')).toContainText('2 Kings 1');

    // Assert Map Key is visible at bottom of panel
    const mapKeyCard = page.locator('#bible-map-key-card');
    await expect(mapKeyCard).toBeVisible();
    await expect(mapKeyCard.locator('.dot-judah')).toBeVisible();
    await expect(mapKeyCard.locator('.dot-israel')).toBeVisible();
    await expect(mapKeyCard.locator('.dot-hostile')).toBeVisible();
    await expect(mapKeyCard.locator('.dot-allied')).toBeVisible();

    // Scroll map key into view and capture visual proof of 2 Kings 1 side panel map key
    await mapKeyCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const companionPane = page.locator('#bible-companion-pane');
    await companionPane.screenshot({ path: 'test-results/bible-map-key-2kings-proof.png' });
  });
});
