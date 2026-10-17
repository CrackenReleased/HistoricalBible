import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Interactive Maps & Cartographic Atlas (Option C)', () => {
  test('Top navigation header includes Map link across all major routes', async ({ page }) => {
    const routes = ['/', '/bible', '/map', '/interact', '/contact'];
    for (const route of routes) {
      await page.goto(route);
      const nav = page.locator('nav.site-nav');
      await expect(nav).toBeVisible();

      const mapLink = nav.locator('a[href="/map"]');
      await expect(mapLink).toBeVisible();
      await expect(mapLink).toHaveText('Map');

      if (route === '/map') {
        await expect(mapLink).toHaveAttribute('aria-current', 'page');
      } else {
        await expect(mapLink).not.toHaveAttribute('aria-current', 'page');
      }
    }
  });

  test('Dedicated Cartographic Atlas (/map) renders 60FPS canvas, layer toggles, and region presets', async ({ page }) => {
    await page.goto('/map');
    await expect(page).toHaveTitle(/Biblical World Map/);

    // Header branding
    await expect(page.locator('header .brand-emblem')).toBeVisible();
    await expect(page.locator('header .brand-white')).toHaveText('Historical');
    await expect(page.locator('header .brand-gold')).toHaveText('Bible');

    // Atlas Title
    await expect(page.locator('#atlas-title')).toHaveText('The Biblical World in History');

    // Map container
    const canvas = page.locator('#atlas-canvas-container');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveClass(/leaflet-container/);
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(300);
    expect(box!.height).toBeGreaterThan(200);

    // Layer toggles
    const layerToggles = page.locator('.atlas-toggle-btn');
    await expect(layerToggles).toHaveCount(5);
    const archToggle = page.locator('.atlas-toggle-btn[data-layer="archaeology"]');
    await expect(archToggle).toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'true');

    // Click toggle to turn off and back on
    await archToggle.click();
    await expect(archToggle).not.toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'false');
    await archToggle.click();
    await expect(archToggle).toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'true');

    // Region Presets
    const presets = page.locator('.atlas-preset-btn');
    await expect(presets).toHaveCount(5);
    const levantBtn = page.locator('.atlas-preset-btn[data-preset="levant"]');
    await levantBtn.click();
    await expect(levantBtn).toHaveClass(/active/);

    // Assert Legend includes Global World Civilizations
    const globalLegend = page.locator('.atlas-legend-item', { hasText: 'Global World Civilizations' });
    await expect(globalLegend).toBeVisible();
    await expect(globalLegend.locator('.map-key-dot.dot-global')).toBeVisible();

    // Zoom controls
    const zoomIn = page.locator('#map-zoom-in');
    const zoomOut = page.locator('#map-zoom-out');
    const reset = page.locator('#map-reset-view');
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
    await expect(reset).toBeVisible();
  });

  test('Direct deep link to an archaeological site (?site=pilate-stone) displays the discovery detail drawer', async ({ page }) => {
    await page.goto('/map?site=pilate-stone');

    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#drawer-title')).toHaveText('The Pilate Stone');
    await expect(page.locator('#drawer-meta')).toContainText('Caesarea Maritima');
    await expect(page.locator('#drawer-desc')).toContainText('PILATUS');
    await expect(page.locator('#drawer-significance')).toContainText('Pontius Pilate');

    // Links to study desk and scripture
    const deskLink = page.locator('#drawer-desk-link');
    await expect(deskLink).toBeVisible();
    await expect(deskLink).toHaveAttribute('href', '/interact?figure=jesus-christ');

    // Close button hides drawer
    await page.locator('#atlas-drawer-close').click();
    await expect(drawer).toBeHidden();
  });

  test('Study Desk (/interact) 3rd column includes Map button that opens ancient map focused on active figure', async ({ page }) => {
    await page.goto('/interact', { waitUntil: 'networkidle' });

    // Ensure 3 view toggle buttons exist
    const listBtn = page.locator('#btn-view-list');
    const graphBtn = page.locator('#btn-view-graph');
    const mapBtn = page.locator('#btn-view-map');

    await expect(listBtn).toBeVisible();
    await expect(graphBtn).toBeVisible();
    await expect(mapBtn).toBeVisible();

    // Default view is List
    await expect(listBtn).toHaveClass(/active/);
    await expect(mapBtn).not.toHaveClass(/active/);
    await expect(page.locator('#ancient-map-container')).toBeHidden();

    // Click Map button
    await mapBtn.click();
    await expect(mapBtn).toHaveClass(/active/);
    await expect(mapBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(listBtn).not.toHaveClass(/active/);

    // Ancient Map container becomes visible and renders Leaflet
    const mapContainer = page.locator('#ancient-map-container');
    await expect(mapContainer).toBeVisible();
    await expect(mapContainer).toHaveClass(/leaflet-container/);

    // URL state synchronizes ?view=map
    expect(page.url()).toContain('view=map');

    // Deep linking to /interact?view=map preserves map view on load
    await page.goto('/interact?figure=daniel&view=map');
    await expect(page.locator('#btn-view-map')).toHaveClass(/active/);
    await expect(page.locator('#ancient-map-container')).toBeVisible();
  });

  test('Zero-Collision & Northern Kingdom of Israel hover accessibility: Only 1 tooltip visible at any time, Northern Kingdom inspectable without overlap', async ({ page }) => {
    await page.goto('/map?era=divided_monarchy_prophets', { waitUntil: 'networkidle' });

    // Ensure Leaflet map canvas is initialized
    const mapContainer = page.locator('#atlas-canvas-container');
    await expect(mapContainer).toBeVisible();

    // Hover over Samaria capital marker (Northern Kingdom of Israel)
    const samariaMarker = page.locator('.capital-marker-label', { hasText: 'Samaria' });
    await expect(samariaMarker).toBeVisible({ timeout: 5000 });
    await samariaMarker.hover();
    await page.waitForTimeout(300);

    // Verify Samaria/Israel tooltip is visible with Northern Kingdom badge
    const activeTooltip = page.locator('.leaflet-tooltip');
    await expect(activeTooltip).toBeVisible();
    await expect(activeTooltip).toContainText('Samaria');
    await expect(activeTooltip).toContainText('NORTHERN KINGDOM');

    // Hover over Jerusalem (Kingdom of Judah)
    const jerusalemMarker = page.locator('.capital-marker-label', { hasText: 'Jerusalem' });
    await expect(jerusalemMarker).toBeVisible();
    await jerusalemMarker.hover();
    await page.waitForTimeout(300);

    // Verify Jerusalem tooltip opened AND Samaria tooltip closed (strictly <= 1 tooltip exists in DOM)
    const tooltipsAfterJerusalem = page.locator('.leaflet-tooltip');
    expect(await tooltipsAfterJerusalem.count()).toBeLessThanOrEqual(1);
    await expect(tooltipsAfterJerusalem).toContainText('Jerusalem');

    // Click Samaria capital pin: Detail drawer opens with full historical dossier
    await samariaMarker.click();
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#drawer-title')).toContainText('Kingdom of Israel (Samaria)');
    await expect(page.locator('#drawer-meta')).toContainText('Capital: Samaria');
  });

  test('Visual proof: captures high-resolution screenshots of map experiences', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Dedicated Atlas (/map)
    await page.goto('/map');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/live_atlas_map.png', fullPage: false });

    // 2. Atlas with detail drawer (?site=pilate-stone)
    await page.goto('/map?site=pilate-stone');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/live_atlas_detail_drawer.png', fullPage: false });

    // 3. Study desk with Map tab active (/interact?view=map)
    await page.goto('/interact?view=map');
    await page.waitForTimeout(800);
    await page.locator('.connections-panel .panel-header').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/live_study_desk_map_tab.png', fullPage: false });
  });
});
