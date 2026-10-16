import { test, expect } from '@playwright/test';

test.describe('Biblical World Map Cartography, Compass Rose & Chronology', () => {
  test('renders high-resolution map with North compass rose and active year display', async ({ page }) => {
    // Navigate to map page
    await page.goto('/map');

    // 1. Assert Leaflet container is initialized
    const mapContainer = page.locator('#atlas-canvas-container');
    await expect(mapContainer).toBeVisible();
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 5000 });

    // 2. Assert Minimal North Compass Indicator (red north, gray south, faint east/west)
    const compassRose = page.locator('.ornate-compass-rose');
    await expect(compassRose).toBeVisible();
    await expect(compassRose.getByText('N', { exact: true })).toBeVisible();

    // 3. Assert Active Year & Chronological Era HUD
    const yearDisplay = page.locator('#chrono-current-year');
    await expect(yearDisplay).toBeVisible();
    await expect(yearDisplay).toContainText('BC');

    const yearWatermark = page.locator('.map-canvas-year-hud');
    await expect(yearWatermark).toBeVisible();

    // 4. Test Era Switching: Click 'Assyrian Siege' (701 BC)
    const assyrianBtn = page.locator('button.chrono-era-btn[data-era="assyrian_siege"]');
    await expect(assyrianBtn).toBeVisible();
    await assyrianBtn.click();

    // Assert Year display updates explicitly to 701 BC
    await expect(yearDisplay).toContainText('701 BC');
    const headline = page.locator('#chrono-headline');
    await expect(headline).toContainText('Assyrian Invasion');
    await expect(assyrianBtn).toHaveClass(/active/);
    await expect(yearWatermark).toContainText('701 BC');

    // 5. Test Era Switching: Click 'Christ & Rome' (AD 30)
    const christBtn = page.locator('button.chrono-era-btn[data-era="roman_christ"]');
    await expect(christBtn).toBeVisible();
    await christBtn.click();

    await expect(yearDisplay).toContainText('AD 33');
    await expect(headline).toContainText('Christ');
    await expect(christBtn).toHaveClass(/active/);

    // 6. Capture visual proof screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/map-chronology-compass-proof.png', fullPage: true });
  });
});
