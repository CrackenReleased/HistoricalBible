import { test, expect } from '@playwright/test';

test('era choice, compass and reset agree without restoring all routes', async ({ page }) => {
  await page.goto('/map');
  await expect(page.locator('.ornate-compass-rose')).toBeVisible();
  await expect(page.locator('#atlas-sequence')).toBeHidden();
  await page.getByLabel('Choose a period').selectOption('roman_christ');
  await expect(page.locator('#chrono-current-year')).toContainText('AD 33');
  await expect(page.locator('.route-stop-core')).toHaveCount(1);
  await page.getByRole('slider', { name: 'Journey sequence' }).press('ArrowRight');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(page.getByLabel('Choose a period')).toHaveValue('roman_christ');
  await expect(page.getByRole('slider', { name: 'Journey sequence' })).toHaveValue('1');
  await expect(page.locator('.route-stop-core')).toHaveCount(1);
});
