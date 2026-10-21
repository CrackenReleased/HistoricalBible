import { test, expect } from '@playwright/test';

test.describe('Historical World Context - Second Slice (Elijah Journey & David/Saul Counterexamples)', () => {
  test('Bible Reader displays Elijah journey stop card for 1 Kings 17:3', async ({ page }) => {
    // 1. Navigate to 1 Kings 17:3 in Bible reader
    await page.goto('/bible?book=1Kgs&chapter=17&verse=3', { waitUntil: 'networkidle' });

    // 2. Open Chrono companion tab
    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // 3. Verify Along this journey narrative stop card (Work Package B)
    const journeyCard = chronoContent.locator('.reviewed-journey-stop-card');
    await expect(journeyCard).toBeVisible();
    await expect(journeyCard).toContainText('ALONG THIS JOURNEY · NARRATIVE SEQUENCE');
    await expect(journeyCard).toContainText('Prophet Elijah: Tishbe, Cherith, Carmel & Jordan Whirlwind');
    await expect(journeyCard).toContainText('Brook Cherith');
    await expect(journeyCard).toContainText('Stop 2 of 7');
    await expect(journeyCard).toContainText('1 KINGS {17:2}–{17:7}');
    await expect(journeyCard).toContainText('ravens bring him bread');

    // 4. Check View Stop on Map link
    const mapLink = journeyCard.locator('a');
    await expect(mapLink).toBeVisible();
    const href = await mapLink.getAttribute('href');
    expect(href).toContain('journey=elijah-prophet');
    expect(href).toContain('stop=1');
  });

  test('Bible Reader displays David ↔ Achish refuge relationship and Western Zhou contemporary horizon (1 Samuel 27:1)', async ({ page }) => {
    await page.goto('/bible?book=1Sam&chapter=27&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // Relationship card: David & Achish refuge
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('RELATIONSHIP AT THIS TIME');
    await expect(relCard).toContainText('David & His Men ↔ Kingdom of Gath (Philistines)');
    await expect(relCard).toContainText('Political asylum, military sanctuary, and feigned tributary vassalage');
    await expect(relCard).toContainText('escape into the land of the Philistines');
    await expect(relCard).toContainText('Crucial counterexample to static faction labeling');

    // Contemporary world horizon: Early Western Zhou Dynasty
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON');
    await expect(worldCard).toContainText('Western Zhou Dynasty');
    await expect(worldCard).toContainText('Feng & Hao');
    await expect(worldCard).toContainText('Records of the Grand Historian (Shiji, Zhou Annals)');
  });

  test('Bible Reader displays Saul ↔ Philistines conflict counterexample (1 Samuel 31:1)', async ({ page }) => {
    await page.goto('/bible?book=1Sam&chapter=31&verse=1', { waitUntil: 'networkidle' });

    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('RELATIONSHIP AT THIS TIME');
    await expect(relCard).toContainText('Kingdom of Israel ↔ Philistine Pentapolis');
    await expect(relCard).toContainText('Full-scale invasion, decisive defeat of Israel, and death of King Saul');
    await expect(relCard).toContainText('Saul was afraid');
    await expect(relCard).toContainText(/directly contemporaneous with David’s sanctuary under Achish/i);
  });

  test('Map page carries journey stop context and focuses camera on stop coordinates', async ({ page }) => {
    await page.goto('/map?ref=1Kgs.17.3&journey=elijah-prophet&stop=1', { waitUntil: 'networkidle' });

    // Drawer should display Brook Cherith stop details
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Brook Cherith');

    // Verify context bar points back to Bible reader
    const contextBar = page.locator('#atlas-context-bar');
    await expect(contextBar).toBeVisible();
    const returnLink = page.locator('#atlas-context-bible');
    await expect(returnLink).toBeVisible();
    const returnHref = await returnLink.getAttribute('href');
    expect(returnHref?.toLowerCase()).toMatch(/\/bible\?ref=(1kgs|1ki)\.17\.3/i);
  });
});
