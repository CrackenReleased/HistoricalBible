import { test, expect } from '@playwright/test';

test('primeval stories are in the menu without invented map pins', async ({ page }) => {
  await page.goto('/map');
  await page.getByLabel('Choose a period').selectOption('primeval');
  const menu = page.getByLabel('Choose a journey', { exact: true });
  await expect(menu).toContainText('Noah');
  const option = menu.locator('option').filter({ hasText: 'Noah' }).first();
  await menu.selectOption(await option.getAttribute('value') as string);
  await expect(page.locator('#drawer-title')).toContainText('Noah');
  await expect(page.locator('#drawer-scripture-link')).toHaveAttribute('href', /ref=Gen\./);
  await expect(page.locator('#atlas-canvas-container .route-stop-core')).toHaveCount(0);
});

test('search returns minor names and Scripture with paging, not unrelated partial matches or markup', async ({ page }) => {
  await page.goto('/map');
  const input = page.locator('#atlas-journey-search');
  const results = page.locator('#atlas-search-results');
  await input.fill('Onesiphorus');
  await expect(results).toContainText('2 TIMOTHY');
  await expect(results.locator('a[href*="ref=2Tim."]').first()).toBeVisible();
  await input.fill('Mary');
  await expect(results.getByRole('button', { name: 'More Scripture results' })).toBeVisible();
  await results.getByRole('button', { name: 'More Scripture results' }).click();
  await expect(results).toContainText('13–');
  await input.fill('Noah impossibleword');
  await expect(results).toContainText('No matching');
  await expect(results.locator('[data-route-id]')).toHaveCount(0);
  await input.fill('<img src=x onerror=alert(1)>');
  await expect(results).toContainText('No matching');
  await expect(results.locator('img')).toHaveCount(0);
  await input.fill('John 3:16');
  await expect(results.locator('a[href="/bible?ref=John.3.16"]')).toBeVisible();
  await input.fill('Black Obelisk');
  await expect(results).toContainText('Archaeological annotation');
  await input.fill("Noah's ark");
  await expect(results).toContainText('Noah, the ark and the flood');
});

test('existing atlas book codes open the correct Bible book', async ({ page }) => {
  await page.goto('/bible?ref=JON.3.3');
  await expect(page.locator('#reader-chapter-title')).toContainText('JONAH');
  await expect(page.locator('#reader-chapter-select')).toHaveValue('3');
});

test('search recovers from corpus failure and preserves literal Scripture on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/data/kjv_verses.json', route => route.abort());
  await page.goto('/map');
  const input = page.locator('#atlas-journey-search');
  const results = page.locator('#atlas-search-results');
  await input.fill('Onesiphorus');
  await expect(results).toContainText('could not load');
  await page.unroute('**/data/kjv_verses.json');
  await results.getByRole('button', { name: 'Retry Scripture search' }).click();
  await expect(results).toContainText('2 TIMOTHY');
  await input.fill('Genesis 2:4');
  await expect(results.locator('.kjv-divine-name').first()).toHaveText('LORD');
  await expect(results.locator('.atlas-search-item')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});


for (const [journey, ref, passage] of [
  ['job-land-of-uz', 'JOB.1.1', 'man in the land of Uz'],
  ['jonah-prophet', '2Kgs.14.25', 'Jonah, the son of Amittai'],
]) {
  test(`${journey} opens its cited passage rather than an unrelated profile`, async ({ page }) => {
    await page.goto(`/map?journey=${journey}`);
    const link = page.locator('#drawer-desk-link');
    await expect(link).toHaveAttribute('href', `/interact?ref=${ref}`);
    await page.reload();
    await expect(link).toHaveAttribute('href', `/interact?ref=${ref}`);
    await link.click();
    await expect(page.locator('#scripture-anchors-list')).toContainText(passage);
  });
}
