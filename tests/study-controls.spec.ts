import { test, expect } from '@playwright/test';

test('STUDY-01: name selection survives sharing, refresh and browser history', async ({ page }) => {
  await page.goto('/interact?tab=names');
  const collection = page.locator('#collection-explorer');
  await collection.getByLabel('Filter collection').fill('Abel');
  await collection.getByRole('button', { name: 'Abel', exact: true }).click();
  await expect(page).toHaveURL(/name=Abel/);
  await page.reload();
  await expect(page.locator('#name-search-title')).toHaveText('Abel');
  await expect(collection.getByLabel('Filter collection')).toHaveValue('Abel');
});
