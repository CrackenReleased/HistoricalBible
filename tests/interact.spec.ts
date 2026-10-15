import { test, expect } from '@playwright/test';

test.describe('HistoricalBible.com/Interact — Local-First 3D Suite', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('/interact.html');
  });

  test('REG-05: Local-First Telemetry and Three.js WebGL canvas mount cleanly', async ({ page }) => {
    // Assert WebGL canvas inside three-container exists
    const canvas = page.locator('#three-container canvas');
    await expect(canvas).toBeVisible();

    // Assert Local-First telemetry bar
    const telemetry = page.locator('#local-telemetry-banner');
    await expect(telemetry).toBeVisible();
    await expect(telemetry).toContainText('Zero Backend Lag');
    await expect(telemetry).toContainText('344,799 Scripture Links');
  });

  test('REG-06: Welcome Onboarding Modal guides user journey', async ({ page }) => {
    const modal = page.locator('#welcome-modal');
    await expect(modal).toBeVisible();

    // Assert 4 curated journey paths
    const journeyCards = page.locator('.journey-card');
    await expect(journeyCards).toHaveCount(4);

    // Click "The Messianic Promise"
    await page.locator('.journey-card[data-target-verse="Gen.3.15"]').click();
    await expect(modal).toBeHidden();

    // Drawer should update to Genesis 3:15
    const title = page.locator('#drawer-verse-title');
    await expect(title).toHaveText('Genesis 3:15');
  });

  test('REG-07: Audited Theological Relations display Bible.pdf citations', async ({ page }) => {
    // Close welcome modal
    await page.locator('.modal-close').click();

    // Inspect Genesis 1:1 default state
    const auditCard = page.locator('#drawer-audit-card');
    await expect(auditCard).toBeVisible();
    await expect(auditCard).toContainText('AUDITED THEOLOGICAL EVIDENCE');
    await expect(auditCard).toContainText('Creator praised as giver of blessing');

    // Cross-reference list should display cards with verified Bible.pdf citations
    const refCard = page.locator('.ref-card.has-audit').first();
    await expect(refCard).toBeVisible();
    await expect(refCard).toContainText('Verified against Bible.pdf');
  });
});
