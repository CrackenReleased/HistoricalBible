import { test, expect } from '@playwright/test';

test.describe('Bible Companion Map - Organic Polygons & External Leader Line Callout', () => {
  test('hovering kingdom on companion map renders external callout outside the map with SVG leader line, leaving map unobstructed', async ({ page }) => {
    // Navigate to Genesis 47 on the Bible Reader with map tab active
    await page.goto('/bible?book=Genesis&chapter=47&tab=map', { waitUntil: 'networkidle' });

    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });

    const mapBox = await mapContainer.boundingBox();
    expect(mapBox).not.toBeNull();

    // Move mouse over the map into Egypt territory (center of companion map)
    const hoverX = mapBox!.x + mapBox!.width * 0.45;
    const hoverY = mapBox!.y + mapBox!.height * 0.55;
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
});
