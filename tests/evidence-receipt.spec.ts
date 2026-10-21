import { test, expect } from '@playwright/test';

test('Gallio path keeps Scripture, inscription attestation, and dating inference distinct', async ({ page }) => {
  await page.goto('/interact?figure=paul');
  const evidence = page.locator('#discovery-evidence');
  await expect(evidence).toContainText('Gallio');
  await expect(evidence.locator('.evidence-receipt')).toContainText('FD III 4:286');
  await expect(evidence.locator('.evidence-receipt')).toContainText('does not describe Paul');
  await expect(evidence.locator('.evidence-receipt')).toContainText('Gallio in Roman literature');
  await expect(evidence.locator('.evidence-receipt')).toContainText('Neither record says Paul met Seneca');
  await evidence.getByRole('link', { name: /View on map/ }).click();
  await expect(page).toHaveURL(/\/map\?site=gallio-inscription/);
  await expect(page.locator('#drawer-title')).toContainText('Gallio');
  await expect(page.locator('#drawer-receipt')).toContainText('FD III 4:286');
  await expect(page.locator('#drawer-receipt')).toContainText('does not describe Paul');
  await page.locator('#drawer-scripture-link').click();
  await expect(page).toHaveURL(/\/bible\?ref=Acts\.18\.12/);
  await expect(page.locator('.bible-verse-row[data-verse="12"]')).toHaveClass(/active-verse/);
});

test('reader distinguishes reviewed quotations from the attributed traditional link archive', async ({ page }) => {
  await page.goto('/bible?ref=Matt.3.3&tab=xrefs');
  const panel = page.locator('#companion-tab-xrefs-content');
  await expect(panel).toContainText('Reviewed connections');
  await expect(panel).toContainText('Explicit quotation');
  await expect(panel).toContainText('Isa.40.3');
  await expect(panel).toContainText('OpenBible suggestions · not individually reviewed');
  await expect(panel.locator('.xref-archive')).not.toHaveAttribute('open');
  await panel.locator('.xref-archive summary').click();
  await expect(panel.locator('.xref-archive')).toHaveAttribute('open');
  await expect(panel.locator('.xref-archive .xref-card-mini').first()).toBeVisible();
  await page.goto('/bible?ref=Acts.18.12&tab=xrefs');
  await expect(panel).toContainText('OpenBible suggestions · not individually reviewed');
  await expect(panel).toContainText('No individually reviewed connection has been established');
});

test('chronology shows only passage-specific reviewed synchronies and an honest undated state', async ({ page }) => {
  await page.goto('/bible?ref=Acts.18.12&tab=chrono');
  const panel = page.locator('#companion-tab-chrono-content');
  await expect(panel).toContainText('REVIEWED PASSAGE SYNCHRONY');
  await expect(panel).toContainText('approximately AD 51–52');
  await expect(panel).toContainText('does not name Paul');
  await expect(panel.getByRole('link', { name: /View on map/ })).toHaveAttribute('href', '/map?site=gallio-inscription');
  await page.goto('/bible?ref=2Kgs.18.13&tab=chrono');
  await expect(panel).toContainText('701 BC');
  await expect(panel).toContainText('Taylor Prism');
  await page.goto('/bible?ref=Gen.1.2&tab=chrono');
  await expect(panel).toContainText('No reviewed event date is established for this selected verse');
  await expect(panel).not.toContainText('REVIEWED PASSAGE SYNCHRONY');
});

test('proposed Erastus identification stays distinct from the pavement inscription', async ({ page }) => {
  await page.goto('/map?site=erastus-inscription');
  await expect(page.locator('#drawer-desc')).toContainText('Corinth VIII.3 no. 232');
  await expect(page.locator('#drawer-desc')).not.toContainText('ERASTVS PRO AEDILITATE');
  await expect(page.locator('#drawer-museum-link')).toContainText('View reviewed source record');
  await expect(page.locator('#drawer-significance')).not.toContainText('Matches Paul');
  await expect(page.locator('#drawer-receipt')).toContainText('proposed passage connection');
  await expect(page.locator('#drawer-receipt')).toContainText('different office terms');
});

test('disputed Siloam attribution and Soloi location remain visible in map receipts', async ({ page }) => {
  await page.goto('/map?site=siloam-inscription');
  await expect(page.locator('#drawer-receipt')).toContainText('disputed passage connection');
  await expect(page.locator('#drawer-receipt')).toContainText('does not name its royal sponsor');
  await expect(page.locator('#drawer-significance')).not.toContainText('Verifies the colossal engineering feat');

  await page.goto('/map?site=sergius-paulus-inscription');
  await expect(page.locator('#drawer-title')).toContainText('Soloi');
  await expect(page.locator('#drawer-receipt')).toContainText('proposed passage connection');
  await expect(page.locator('#drawer-receipt')).toContainText('does not preserve Sergius');
  await expect(page.locator('#drawer-significance')).not.toContainText('explains why Paul immediately traveled');
});
