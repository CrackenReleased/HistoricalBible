import { test, expect } from '@playwright/test';

test('fresh atlas introduces one story instead of rendering every route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  await expect(page.getByRole('heading', { name: 'Every journey begins with a place.' })).toBeVisible();
  await expect(page.locator('#atlas-canvas-container .leaflet-route-stop-marker')).toHaveCount(0);
  await expect(page.locator('#atlas-canvas-container .route-badge-pill')).toHaveCount(0);
  await expect(page.getByLabel('Choose a period')).toHaveValue('');
  await expect(page.getByRole('slider', { name: 'Journey sequence' })).toBeHidden();
  await page.screenshot({ path: 'test-results/atlas-reading-entry-desktop.png' });
});

test('a journey reveals one stop, reverses, and preserves layers through show all', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  await page.getByLabel('Choose a period').selectOption('apostolic_church');
  await expect(page.getByLabel('Choose a journey')).toHaveValue('paul-first-journey');
  const slider = page.getByRole('slider', { name: 'Journey sequence' });
  await expect(slider).toBeVisible();
  await expect(page.locator('#drawer-title')).toContainText('Antioch');
  await expect(page.locator('#drawer-scripture-link')).toHaveAttribute('href', '/bible?ref=ACT.13.2');
  await page.locator('.atlas-source-note summary').click();
  await expect(page.locator('#drawer-significance')).toContainText('Acts 13–14');
  await page.screenshot({ path: 'test-results/atlas-reading-apostolic-desktop.png' });

  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toBeFocused();
  await expect(slider).toHaveValue('1');
  await expect(page.locator('#drawer-title')).toContainText('Paphos');
  await expect(page.locator('#atlas-canvas-container .route-stop-core')).toHaveCount(1);
  await slider.press('ArrowLeft');
  await expect(page.locator('#drawer-title')).toContainText('Antioch');
  await page.getByText('What to show', { exact: true }).click();
  const artifacts = page.getByRole('button', { name: 'Archaeological Finds', exact: true });
  await artifacts.click();
  await page.getByRole('button', { name: 'Show all stops', exact: true }).click();
  await expect(page.locator('#atlas-canvas-container .route-stop-core')).toHaveCount(8);
  await expect(artifacts).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: 'test-results/atlas-reading-show-all-desktop.png' });

  await page.getByRole('button', { name: 'Return to selected stop', exact: true }).click();
  await expect(page.locator('#atlas-canvas-container .route-stop-core')).toHaveCount(1);
  await expect(slider).toHaveValue('0');
});

test('mobile layout, touch targets, and contrast meet reading-first thresholds without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map');
  await page.getByLabel('Choose a period').selectOption('apostolic_church');
  await expect(page.locator('#atlas-sequence')).toBeVisible();
  await expect(page.locator('#atlas-detail-drawer')).toBeVisible();

  await page.locator('.atlas-source-note summary').click();

  const metrics = await page.evaluate(() => {
    const parseRgb = (c: string) => {
      const m = c.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0];
      return m.slice(0, 3);
    };
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (fg: string, bg: string) => {
      const l1 = lum(parseRgb(fg));
      const l2 = lum(parseRgb(bg));
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const seqBg = getComputedStyle(document.getElementById('atlas-sequence')!).backgroundColor;
    const drawerBg = getComputedStyle(document.getElementById('atlas-detail-drawer')!).backgroundColor;
    const sourceNoteBg = getComputedStyle(document.querySelector('.atlas-source-note')!).backgroundColor;
    const effectiveSourceBg = sourceNoteBg === 'rgba(0, 0, 0, 0)' ? drawerBg : sourceNoteBg;

    const contrasts = {
      title: ratio(getComputedStyle(document.getElementById('atlas-title')!).color, bodyBg),
      intro: ratio(getComputedStyle(document.getElementById('atlas-introduction')!).color, bodyBg),
      seqSummary: ratio(getComputedStyle(document.getElementById('chrono-summary')!).color, seqBg),
      drawerTitle: ratio(getComputedStyle(document.getElementById('drawer-title')!).color, drawerBg),
      drawerMeta: ratio(getComputedStyle(document.getElementById('drawer-meta')!).color, drawerBg),
      drawerDesc: ratio(getComputedStyle(document.getElementById('drawer-desc')!).color, drawerBg),
      sourceSummary: ratio(getComputedStyle(document.querySelector('.atlas-source-note > summary')!).color, effectiveSourceBg),
      drawerSig: ratio(getComputedStyle(document.getElementById('drawer-significance')!).color, effectiveSourceBg),
    };

    const heights = [
      '#atlas-era',
      '#atlas-journey',
      '#atlas-sequence-slider',
      '#stepper-prev-btn',
      '#stepper-next-btn',
      '#atlas-show-all',
      '#atlas-drawer-close'
    ].map(sel => ({
      sel,
      height: document.querySelector(sel)!.getBoundingClientRect().height
    }));

    return {
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      mapHeight: document.getElementById('atlas-canvas-container')!.getBoundingClientRect().height,
      contrasts,
      heights
    };
  });

  expect(metrics.overflowX).toBeLessThanOrEqual(0);
  expect(metrics.mapHeight).toBeGreaterThanOrEqual(360);
  for (const [key, val] of Object.entries(metrics.contrasts)) {
    expect(val, `contrast for ${key}`).toBeGreaterThanOrEqual(4.5);
  }
  for (const item of metrics.heights) {
    expect(item.height, `touch target height for ${item.sel}`).toBeGreaterThanOrEqual(44);
  }

  await page.screenshot({ path: 'test-results/atlas-reading-apostolic-mobile.png', fullPage: true });
});

test('turning on World Empires reveals the Map Key directly above the map canvas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');

  const legend = page.locator('#atlas-legend');
  await expect(legend).toBeHidden();

  await page.getByText('What to show', { exact: true }).click();
  const empiresBtn = page.getByRole('button', { name: 'World Empires', exact: true });
  await empiresBtn.click();

  await expect(empiresBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(legend).toBeVisible();
  await expect(legend).toContainText('Kingdom of Judah');
  await expect(legend).toContainText('Kingdom of Israel');
  await expect(legend).toContainText('Hostile Empires');
  await expect(legend).toContainText('Friendly & Allied Regions');
  await expect(legend).toContainText('Global World Civilizations');

  const geometry = await page.evaluate(() => {
    const legendRect = document.getElementById('atlas-legend')!.getBoundingClientRect();
    const mapRect = document.querySelector('.atlas-canvas-card')!.getBoundingClientRect();
    return {
      legendBottom: legendRect.bottom,
      mapTop: mapRect.top,
      legendWidth: legendRect.width,
      mapWidth: mapRect.width
    };
  });

  expect(geometry.legendBottom).toBeLessThanOrEqual(geometry.mapTop + 1);
  expect(Math.abs(geometry.legendWidth - geometry.mapWidth)).toBeLessThanOrEqual(2);

  await empiresBtn.click();
  await expect(empiresBtn).toHaveAttribute('aria-pressed', 'false');
  await expect(legend).toBeHidden();
});

test('deep green reading atlas theme and cross-page reading context continuity (/bible -> /map)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. User reads Acts 13 in /bible
  await page.goto('/bible?book=Acts&chapter=13');
  await expect(page.locator('#reader-chapter-title')).toContainText('ACTS');

  // 2. User clicks Map in the site header navigation
  await page.locator('nav.site-nav a[href="/map"]').click();
  await expect(page).toHaveURL(/\/map$/);
  await expect(page.locator('#atlas-canvas-container .leaflet-tile-pane')).toBeAttached();

  // 3. Verify /map shares the deep green reading atlas theme
  const themeColors = await page.evaluate(() => {
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const tileFilter = getComputedStyle(document.querySelector('.leaflet-tile-pane')!).filter;
    return { bodyBg, tileFilter };
  });
  expect(themeColors.bodyBg).toBe('rgb(23, 26, 24)');
  expect(themeColors.tileFilter).toContain('sepia');

  // 4. Verify #atlas-context-bar is visible and self-aware of the user's Acts 13 reading session
  const contextBar = page.locator('#atlas-context-bar');
  await expect(contextBar).toBeVisible();
  await expect(contextBar).toContainText('Acts 13');
  await expect(page.locator('#atlas-context-bible')).toHaveAttribute('href', /\/bible\?book=Acts&chapter=13/);

  // 5. Clicking #atlas-context-apply focuses the map on the Apostolic Age & Paul's First Journey
  await page.locator('#atlas-context-apply').click();
  await expect(page.getByLabel('Choose a period')).toHaveValue('apostolic_church');
  await expect(page.getByLabel('Choose a journey')).toHaveValue('paul-first-journey');
  await expect(page.locator('#atlas-detail-drawer')).toBeVisible();

  const drawerBg = await page.evaluate(() => getComputedStyle(document.getElementById('atlas-detail-drawer')!).backgroundColor);
  expect(drawerBg).toBe('rgb(232, 223, 205)');
});

test('what to show is on its own line, map fills screen generously, and leaflet attribution has no flag', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');

  // Select a period so both Choose a period and Choose a journey are visible alongside What to show
  await page.getByLabel('Choose a period').selectOption('patriarchs');
  await expect(page.getByLabel('Choose a journey')).toBeVisible();

  // 1. Verify 'What to show' is on its own line below the period/journey fields and above timeline slider
  const positions = await page.evaluate(() => {
    const eraRect = document.getElementById('atlas-era')!.getBoundingClientRect();
    const journeyRect = document.getElementById('atlas-journey')!.getBoundingClientRect();
    const visibilityRect = document.getElementById('atlas-visibility')!.getBoundingClientRect();
    const summaryRect = document.querySelector('#atlas-visibility > summary')!.getBoundingClientRect();
    const sequenceRect = document.getElementById('atlas-sequence')!.getBoundingClientRect();
    const controlsRect = document.querySelector('.atlas-reading-controls')!.getBoundingClientRect();

    return {
      eraBottom: eraRect.bottom,
      journeyBottom: journeyRect.bottom,
      summaryTop: summaryRect.top,
      summaryBottom: summaryRect.bottom,
      summaryLeft: summaryRect.left,
      controlsLeft: controlsRect.left,
      sequenceTop: sequenceRect.top
    };
  });

  // What to show summary must be strictly below period and journey pickers
  expect(positions.summaryTop).toBeGreaterThanOrEqual(positions.eraBottom);
  expect(positions.summaryTop).toBeGreaterThanOrEqual(positions.journeyBottom);

  // What to show summary must be strictly above the sequence timeline slider
  expect(positions.summaryBottom).toBeLessThanOrEqual(positions.sequenceTop);

  // What to show must be left-aligned on its own line, not pushed to the far right
  expect(positions.summaryLeft - positions.controlsLeft).toBeLessThanOrEqual(20);

  // 2. Verify map fills much more of the screen vertically and horizontally
  const mapGeometry = await page.evaluate(() => {
    const card = document.querySelector('.atlas-canvas-card')!.getBoundingClientRect();
    const canvas = document.getElementById('atlas-canvas-container')!.getBoundingClientRect();
    return {
      cardHeight: card.height,
      canvasHeight: canvas.height,
      viewportHeight: window.innerHeight
    };
  });

  // At 900px viewport, map height must fill at least 70% of viewport (> 630px, e.g. ~700px)
  expect(mapGeometry.canvasHeight).toBeGreaterThanOrEqual(650);

  // 3. Verify Leaflet attribution does not display Ukrainian flag
  const flagElements = page.locator('.leaflet-attribution-flag');
  const flagCount = await flagElements.count();
  if (flagCount > 0) {
    const isVisible = await flagElements.first().isVisible();
    expect(isVisible).toBe(false);
  }

  // Attribution text remains complete for Leaflet and Esri
  const attribText = await page.locator('.leaflet-control-attribution').innerText();
  expect(attribText).toContain('Leaflet');
  expect(attribText).toContain('Esri');
  await page.locator('.leaflet-control-attribution').screenshot({ path: 'test-results/leaflet-attribution.png' });
});


