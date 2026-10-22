import { test, expect } from '@playwright/test';

test.describe('Bible Companion Map - Organic Polygons & External Leader Line Callout', () => {
  test('hovering kingdom on companion map renders external callout outside the map with SVG leader line, leaving map unobstructed', async ({ page }) => {
    // Navigate to Genesis 47 on the Bible Reader with map tab active
    await page.goto('/bible?book=Genesis&chapter=47&tab=map', { waitUntil: 'networkidle' });

    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    await mapContainer.scrollIntoViewIfNeeded();

    const mapBox = await mapContainer.boundingBox();
    expect(mapBox).not.toBeNull();

    // Ensure kingdom polygons are rendered and hover the visible interactive polygon
    const activeEmpirePaths = mapContainer.locator('.leaflet-pane.leaflet-empire-pane path.leaflet-interactive:not([d="M0 0"])');
    await expect(activeEmpirePaths.first()).toBeVisible({ timeout: 7000 });

    const hoverX = mapBox!.x + mapBox!.width * 0.45;
    const hoverY = mapBox!.y + 45;
    await page.mouse.move(hoverX, hoverY);

    // Wait for the hover callout to appear
    const externalCallout = page.locator('#map-external-floating-callout');
    await expect(externalCallout).toBeVisible({ timeout: 5000 });

    // Assert that the callout is positioned OUTSIDE the map (to the left of the map container on desktop)
    const calloutBox = await externalCallout.boundingBox();
    expect(calloutBox).not.toBeNull();

    // On viewport width >= 960 (desktop), callout should be to the left of the map container
    if (page.viewportSize() && page.viewportSize()!.width >= 960) {
      expect(calloutBox!.x + calloutBox!.width).toBeLessThanOrEqual(mapBox!.x + 10);
    }

    // Assert that the SVG connector line is present and visible
    const connectorSvg = page.locator('#map-callout-connector-svg');
    await expect(connectorSvg).toBeVisible();

    const connectorCurve = connectorSvg.locator('.map-connector-curve');
    await expect(connectorCurve).toBeVisible();
    const dAttr = await connectorCurve.getAttribute('d');
    expect(dAttr).toBeTruthy();
    expect(dAttr).toContain('M');
    expect(dAttr).toContain('C');

    // Assert the connector pulse dot is placed at the cursor location
    const connectorDot = connectorSvg.locator('.map-connector-dot');
    await expect(connectorDot).toBeVisible();
    const cx = Number(await connectorDot.getAttribute('cx'));
    const cy = Number(await connectorDot.getAttribute('cy'));
    expect(Math.abs(cx - hoverX)).toBeLessThanOrEqual(5);
    expect(Math.abs(cy - hoverY)).toBeLessThanOrEqual(5);

    // Assert the internal map container is NOT covered by an oversized internal tooltip
    const internalTrappedTooltips = mapContainer.locator('.leaflet-tooltip');
    expect(await internalTrappedTooltips.count()).toBe(0);

    // Moving mouse out hides the external callout
    await page.mouse.move(10, 10);
    await expect(externalCallout).toBeHidden();
    await expect(connectorSvg).toBeHidden();
  });

  test('kingdom polygons render with smooth organic curvature and dual-stroke cartographic halo', async ({ page }) => {
    await page.goto('/bible?book=Genesis&chapter=47&tab=map', { waitUntil: 'networkidle' });

    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    // Verify SVG paths in the empirePane exist with smooth paths and outer halos
    const activeEmpirePaths = mapContainer.locator('.leaflet-pane.leaflet-empire-pane svg path:not([d="M0 0"])');
    await expect(activeEmpirePaths.first()).toBeVisible({ timeout: 5000 });
    const count = await activeEmpirePaths.count();
    expect(count).toBeGreaterThanOrEqual(2); // At least inner polygon + outer halo

    // Verify smooth path data (has multiple segments)
    const firstPathD = await activeEmpirePaths.first().getAttribute('d');
    expect(firstPathD).toBeTruthy();
    const pathPointCount = (firstPathD!.match(/L/g) || []).length;
    expect(pathPointCount).toBeGreaterThanOrEqual(15);
  });

  test('overlapping and contested territorial frontiers render with dashed lines (stroke-dasharray) denoting argued sovereignty', async ({ page }) => {
    await page.goto('/bible?book=Genesis&chapter=47&tab=map', { waitUntil: 'networkidle' });

    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    // In Genesis 47 (Patriarchs era with Egypt and Kush active in Lower Nubia),
    // verify that SVG paths with stroke-dasharray exist in the empirePane denoting argued frontiers
    const dashedPaths = mapContainer.locator('.leaflet-pane.leaflet-empire-pane svg path[stroke-dasharray]:not([d="M0 0"])');
    await expect(dashedPaths.first()).toBeVisible({ timeout: 7000 });
    const dashedCount = await dashedPaths.count();
    expect(dashedCount).toBeGreaterThanOrEqual(1);

    const dashVal = await dashedPaths.first().getAttribute('stroke-dasharray');
    expect(dashVal).toBeTruthy();
    expect(dashVal).toMatch(/\d+,\s*\d+/);
  });

  test('standalone /map page renders dashed overlapping borders for argued frontiers across multiple eras (Divided Kingdom & Persian)', async ({ page }) => {
    // 1. Divided Monarchy in /map
    await page.goto('/map?era=divided_monarchy_prophets', { waitUntil: 'networkidle' });
    
    // Open 'What to show' disclosure to toggle World Empires layer
    const disclosure = page.locator('#atlas-visibility');
    if (!(await disclosure.getAttribute('open'))) {
      await page.locator('#atlas-visibility summary').click();
    }
    const empiresBtn = page.locator('button.atlas-toggle-btn[data-layer="empires"]');
    await expect(empiresBtn).toBeVisible({ timeout: 5000 });
    if ((await empiresBtn.getAttribute('aria-pressed')) !== 'true') {
      await empiresBtn.click();
    }

    const dashedPaths = page.locator('.leaflet-pane.leaflet-empire-pane svg path[stroke-dasharray]:not([d="M0 0"])');
    await expect(dashedPaths.first()).toBeVisible({ timeout: 10000 });
    const dashedCount = await dashedPaths.count();
    expect(dashedCount).toBeGreaterThanOrEqual(2);

    // 2. Switch to Persian Restoration period
    const eraSelect = page.locator('#atlas-era');
    await eraSelect.selectOption('persian_restoration');
    await page.waitForTimeout(600);

    const persianDashed = page.locator('.leaflet-pane.leaflet-empire-pane svg path[stroke-dasharray]:not([d="M0 0"])');
    expect(await persianDashed.count()).toBeGreaterThanOrEqual(1);
  });

  test('Study Desk (/interact) embedded map renders with organic smoothed kingdom contours', async ({ page }) => {
    await page.goto('/interact?figure=david&view=map', { waitUntil: 'networkidle' });

    const mapContainer = page.locator('#ancient-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    const paths = mapContainer.locator('.leaflet-pane.leaflet-empire-pane svg path:not([d="M0 0"])');
    await expect(paths.first()).toBeVisible({ timeout: 7000 });
    expect(await paths.count()).toBeGreaterThan(0);
  });

  test('Bible companion sidebar map suppresses unrelated artifact coins and removes pulsing animations', async ({ page }) => {
    // 1. In Genesis 47 (no dated event), archaeology coins must NOT render in sidebar companion map
    await page.goto('/bible?book=Genesis&chapter=47&tab=map', { waitUntil: 'networkidle' });
    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    const goldMarkers = mapContainer.locator('.leaflet-gold-marker');
    expect(await goldMarkers.count()).toBe(0);

    // Bottom-left year HUD must be hidden in compact sidebar map
    const yearHud = mapContainer.locator('.map-canvas-year-hud');
    expect(await yearHud.count()).toBe(0);

    // 2. In full /map view, coins exist, are small (12x12), and NEVER have .pulse class or .geo-focus-ping
    await page.goto('/map?era=assyrian_siege', { waitUntil: 'networkidle' });
    const fullMapContainer = page.locator('#atlas-canvas-container');
    await expect(fullMapContainer).toBeVisible({ timeout: 10000 });

    // Enable Archaeological Finds layer via disclosure
    const disclosure = page.locator('#atlas-visibility');
    if (!(await disclosure.getAttribute('open'))) {
      await page.locator('#atlas-visibility summary').click();
    }
    const archBtn = page.locator('button.atlas-toggle-btn[data-layer="archaeology"]');
    await expect(archBtn).toBeVisible({ timeout: 5000 });
    if ((await archBtn.getAttribute('aria-pressed')) !== 'true') {
      await archBtn.click();
    }

    const fullCoins = fullMapContainer.locator('.leaflet-gold-marker');
    await expect(fullCoins.first()).toBeVisible({ timeout: 10000 });

    // Assert no pulsing class
    const pulsingCoins = fullMapContainer.locator('.leaflet-gold-marker.pulse');
    expect(await pulsingCoins.count()).toBe(0);

    // Assert coin core size is muted (<= 14px)
    const firstCoinCore = fullCoins.first().locator('.gold-coin-core');
    const coinBox = await firstCoinCore.boundingBox();
    expect(coinBox).not.toBeNull();
    expect(coinBox!.width).toBeLessThanOrEqual(14);
    expect(coinBox!.height).toBeLessThanOrEqual(14);
  });

  test('dismissing artifact drawer or clicking map clears active geographic focus pin', async ({ page }) => {
    await page.goto('/bible?book=Jonah&chapter=1&tab=map', { waitUntil: 'networkidle' });
    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    // Click entity 'Nineveh' in Scripture text to activate geographic focus
    const entityLink = page.locator('.kjv-word[data-word="nineveh"]').first();
    await expect(entityLink).toBeVisible({ timeout: 7000 });
    await entityLink.click();

    // Verify geographic focus marker is added and has NO pulsing ping element
    const focusMarker = mapContainer.locator('.leaflet-geo-focus-marker');
    await expect(focusMarker).toBeVisible({ timeout: 5000 });
    const pingRing = focusMarker.locator('.geo-focus-ping');
    expect(await pingRing.count()).toBe(0);

    // Verify artifact drawer is displayed
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Click drawer close button
    const closeBtn = drawer.locator('.artifact-drawer-close');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    // Verify drawer is dismissed and focus marker on map is cleared
    await expect(drawer).toBeHidden();
    expect(await mapContainer.locator('.leaflet-geo-focus-marker').count()).toBe(0);
  });
});
