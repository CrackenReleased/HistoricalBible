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

    // 7. Capture visual proof screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/bible-side-by-side-map-proof.png', fullPage: false });
  });
});
