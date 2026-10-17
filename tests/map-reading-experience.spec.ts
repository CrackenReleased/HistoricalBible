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

