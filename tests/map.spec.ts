import { test, expect, type Page } from '@playwright/test';

// v00.01.45: intentional new entry/controls replace all-layers-on and banner-wall
// assumptions. Keep geography, layering, tooltips, deep links and shared-map protection.
async function enableContext(page: Page) {
  await page.getByText('What to show', { exact: true }).click();
  for (const name of ['Archaeological Finds', 'World Empires']) {
    const toggle = page.getByRole('button', { name, exact: true });
    if (await toggle.getAttribute('aria-pressed') !== 'true') await toggle.click();
  }
  await page.getByText('What to show', { exact: true }).click();
}

test('navigation retains the map across the site', async ({ page }) => {
  for (const route of ['/', '/bible', '/map', '/interact', '/contact']) {
    await page.goto(route);
    await expect(page.locator('nav.site-nav a[href="/map"]')).toBeVisible();
  }
});

test('layers and region controls are introduced on demand', async ({ page }) => {
  await page.goto('/map');
  await expect(page.locator('.atlas-toggle-btn')).toHaveCount(5);
  await expect(page.locator('.atlas-toggle-btn').first()).toBeHidden();
  await page.getByText('What to show', { exact: true }).click();
  const artifacts = page.getByRole('button', { name: 'Archaeological Finds', exact: true });
  await expect(artifacts).toHaveAttribute('aria-pressed', 'false');
  await artifacts.click();
  await expect(artifacts).toHaveAttribute('aria-pressed', 'true');
  await artifacts.click();
  await expect(artifacts).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'The Holy Land', exact: true }).click();
  for (const id of ['map-zoom-in', 'map-zoom-out', 'map-reset-view']) {
    await expect(page.locator('#' + id)).toBeVisible();
  }
});

test('site deep links open the requested artifact and working reading links', async ({ page }) => {
  await page.goto('/map?site=pilate-stone');
  await expect(page.locator('#drawer-title')).toHaveText('The Pilate Stone');
  await expect(page.locator('#drawer-meta')).toContainText('Caesarea Maritima');
  await expect(page.locator('#drawer-desc')).toContainText('caes0043');
  await expect(page.locator('#drawer-desc')).not.toContainText('PILATUS');
  await expect(page.locator('#drawer-receipt')).toContainText('does not mention Jesus');
  await expect(page.locator('#drawer-desk-link')).toHaveAttribute('href', '/interact?figure=jesus-christ');
  await expect(page.locator('#drawer-scripture-link')).toHaveAttribute('href', /\/bible\?ref=/);
  await page.locator('#atlas-drawer-close').click();
  await expect(page.locator('#atlas-detail-drawer')).toBeHidden();
});

test('waterways retain solid boundaries and correct pane hierarchy', async ({ page }) => {
  await page.goto('/map?era=united_monarchy');
  await enableContext(page);
  for (const pane of ['empire', 'lake', 'river']) {
    const paths = page.locator('.leaflet-' + pane + '-pane svg path');
    expect(await paths.count()).toBeGreaterThan(0);
    if (pane === 'lake') for (const path of await paths.all()) {
      expect(await path.getAttribute('stroke-dasharray')).toBeNull();
    }
  }
  const order = await page.evaluate(() => {
    const z = (name: string) => Number(getComputedStyle(document.querySelector('.leaflet-' + name + '-pane')!).zIndex);
    return ['water', 'empire', 'lake', 'river', 'route', 'city', 'site', 'routeStop', 'tooltip'].map(z);
  });
  for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThanOrEqual(order[i - 1]);
  await expect(page.locator('.leaflet-water-label', { hasText: 'THE GREAT SEA' })).toBeVisible();
});

test('hover remains exclusive and constrained after the reading layout changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map?era=divided_monarchy_prophets');
  await enableContext(page);
  await page.locator('#atlas-drawer-close').click();
  await page.getByText('What to show', { exact: true }).click();
  await page.getByRole('button', { name: 'The Holy Land', exact: true }).click();
  await page.getByText('What to show', { exact: true }).click();
  for (const name of ['Samaria', 'Jerusalem']) {
    const marker = page.locator('.capital-marker-label', { hasText: name }).first();
    await marker.hover();
    const tooltip = page.locator('.leaflet-tooltip');
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip).toContainText(name);
    const bounds = await tooltip.evaluate(el => {
      const r = el.getBoundingClientRect();
      const m = document.getElementById('atlas-canvas-container')!.getBoundingClientRect();
      return { left: r.left - m.left, right: m.right - r.right, top: r.top - m.top, bottom: m.bottom - r.bottom, whiteSpace: getComputedStyle(el).whiteSpace };
    });
    expect(bounds.whiteSpace).toBe('normal');
    for (const value of [bounds.left, bounds.right, bounds.top, bounds.bottom]) expect(value).toBeGreaterThanOrEqual(0);
  }
  await page.locator('.capital-marker-label', { hasText: 'Samaria' }).first().click();
  await expect(page.locator('#drawer-title')).toContainText('Kingdom of Israel');
});

test('markers keep absolute anchors and geographical ordering', async ({ page }) => {
  await page.goto('/map?era=all');
  await enableContext(page);
  await page.locator('#atlas-drawer-close').click();
  const markers = await page.locator('.leaflet-gold-marker').evaluateAll(elements => elements.map(el => {
    const h = el as HTMLElement;
    const transform = new DOMMatrix(getComputedStyle(h).transform);
    return { label: h.innerText, position: getComputedStyle(h).position, top: h.offsetTop, left: h.offsetLeft, x: transform.m41, y: transform.m42 };
  }));
  expect(markers.length).toBeGreaterThan(10);
  for (const marker of markers) {
    expect(marker.position).toBe('absolute');
    expect(marker.top).toBe(-14);
    expect(marker.left).toBe(-14);
  }
  const find = (text: string) => {
    const found = markers.find(m => m.label.includes(text));
    expect(found, text).toBeDefined();
    return found!;
  };
  const rome = find('Arch of Titus'), levant = find('Pilate Stone'), egypt = find('Merneptah'), babylon = find('Cyrus Cylinder');
  expect(rome.x).toBeLessThan(levant.x);
  expect(rome.y).toBeLessThan(levant.y);
  expect(egypt.y).toBeGreaterThan(levant.y);
  expect(babylon.x).toBeGreaterThan(levant.x);
  for (const selector of ['.leaflet-capital-marker', '.leaflet-city-marker']) {
    const positions = await page.locator(selector).evaluateAll(elements => elements.map(el => getComputedStyle(el).position));
    expect(positions.length).toBeGreaterThan(0);
    expect(positions.every(p => p === 'absolute')).toBe(true);
  }
});

test('legacy journey links remain available with external-source distinction', async ({ page }) => {
  await page.goto('/map?era=apostolic_church&filter=filter-thomas-india');
  await expect(page.getByLabel('Choose a journey')).toHaveValue('thomas-parthia-india');
  await expect(page.locator('#atlas-sequence')).toBeVisible();
  await page.locator('.atlas-source-note summary').click();
  await expect(page.locator('#drawer-significance')).not.toBeEmpty();
  await page.getByRole('slider', { name: 'Journey sequence' }).press('End');
  await expect(page.getByRole('button', { name: 'Next chronological stop' })).toBeDisabled();
  await expect(page.locator('#atlas-show-all')).toHaveAttribute('aria-pressed', 'false');
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


test('invalid URL inputs keep the quiet entry and do not execute selectors', async ({ page }) => {
  await page.goto('/map?era=missing&region=%22%5D&site=missing');
  await expect(page.getByLabel('Choose a period')).toHaveValue('');
  await expect(page.locator('.route-stop-core')).toHaveCount(0);
  await expect(page.locator('#atlas-detail-drawer')).toBeHidden();
});
