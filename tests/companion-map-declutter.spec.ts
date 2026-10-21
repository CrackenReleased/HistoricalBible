import { test, expect } from '@playwright/test';

test.describe('Bible Reader Companion Map - UI/UX Overlay Decluttering & Layer Chips', () => {
  test('renders quick layer filter chips and allows toggling layers on companion map', async ({ page }) => {
    await page.goto('/bible?book=Gen&chapter=1&tab=map', { waitUntil: 'networkidle' });

    // Assert layer filter chips toolbar exists
    const chipsToolbar = page.locator('#companion-map-layer-chips');
    await expect(chipsToolbar).toBeVisible();

    const placesChip = page.locator('.map-layer-chip[data-layer="cities"]');
    const kingdomsChip = page.locator('.map-layer-chip[data-layer="empires"]');
    const artifactsChip = page.locator('.map-layer-chip[data-layer="archaeology"]');
    const journeysChip = page.locator('.map-layer-chip[data-layer="routes"]');

    await expect(placesChip).toBeVisible();
    await expect(kingdomsChip).toBeVisible();
    await expect(artifactsChip).toBeVisible();
    await expect(journeysChip).toBeVisible();

    // Default states for non-journey chapter (Gen 1):
    await expect(placesChip).toHaveClass(/active/);
    await expect(kingdomsChip).toHaveClass(/active/);
    await expect(artifactsChip).toHaveClass(/active/);
    // Routes should be inactive on non-journey chapters to prevent spiderweb line clutter
    await expect(journeysChip).not.toHaveClass(/active/);

    // Toggle kingdoms chip off
    await kingdomsChip.click();
    await expect(kingdomsChip).not.toHaveClass(/active/);

    // Toggle kingdoms chip back on
    await kingdomsChip.click();
    await expect(kingdomsChip).toHaveClass(/active/);
  });

  test('spotlights active narrative journey route and auto-activates journeys chip on journey passage (1 Kings 17:3)', async ({ page }) => {
    await page.goto('/bible?book=1Kgs&chapter=17&verse=3&tab=map', { waitUntil: 'networkidle' });

    // On journey passage, journeys chip auto-activates
    const journeysChip = page.locator('.map-layer-chip[data-layer="routes"]');
    await expect(journeysChip).toHaveClass(/active/);

    // Stop card appears in drawer below map
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Brook Cherith');
    await expect(drawer).toContainText('Prophet Elijah');
  });

  test('clicking place in Scripture displays luminous focus pin without blocking map with oversized popup', async ({ page }) => {
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    // Click "Tishbite"
    const tishbiteWord = page.locator('.kjv-word[data-word="tishbite"]').first();
    await expect(tishbiteWord).toBeVisible();
    await tishbiteWord.click();

    // Luminous focus pin is placed on the map
    const focusPin = page.locator('.leaflet-geo-focus-marker');
    await expect(focusPin).toBeVisible();
    await expect(focusPin).toContainText('Tishbe in Gilead');

    // In compact mode, no screen-blocking leaflet popup should cover the map
    const giantPopup = page.locator('.map-leaflet-popup');
    await expect(giantPopup).toHaveCount(0);

    // Full detail dossier is cleanly readable in the drawer below the map
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Tishbe in Gilead');
    await expect(drawer).toContainText('Hometown of the Prophet Elijah');
  });

  test('clicking "View Stop on Map" in Chronology flips directly to companion Map tab in sidebar', async ({ page }) => {
    await page.goto('/bible?book=1Kgs&chapter=17&verse=3&tab=chrono', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    const mapTabBtn = page.locator('#companion-tab-map-btn');
    await expect(chronoTabBtn).toHaveClass(/active/);

    // Click in-page jump link "View Stop on Map →"
    const jumpLink = page.locator('.chrono-map-jump[data-jump-type="journey"]').first();
    await expect(jumpLink).toBeVisible();
    await jumpLink.click();

    // Companion panel smoothly flips to Map tab without leaving the reading session
    await expect(mapTabBtn).toHaveClass(/active/);
    const mapContent = page.locator('#companion-tab-map-content');
    await expect(mapContent).toBeVisible();

    // Drawer displays the stop
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Brook Cherith');
  });
});
