import { test, expect } from '@playwright/test';

test.describe('Bible Entity Click Navigation & Map First Experience', () => {
  test('Clicking Pharaoh in Genesis 47 switches to Map, zooms to Egypt, shows approx year, power region, allies, and paths', async ({ page }) => {
    // 1. Navigate to Genesis 47 on default reading view (starts on xrefs tab)
    await page.goto('/bible?book=Genesis&chapter=47', { waitUntil: 'networkidle' });

    const mapTabBtn = page.locator('#companion-tab-map-btn');
    const wordTabBtn = page.locator('#companion-tab-word-btn');
    const xrefsTabBtn = page.locator('#companion-tab-xrefs-btn');
    const mapContent = page.locator('#companion-tab-map-content');
    const wordContent = page.locator('#companion-tab-word-content');

    // Initially xrefs tab is active
    await expect(xrefsTabBtn).toHaveClass(/active/);
    await expect(mapContent).toBeHidden();

    // 2. Click the word "Pharaoh" in Genesis 47:3
    const pharaohWord = page.locator('.bible-verse-row[data-verse="3"] .kjv-word[data-word="pharaoh"]').first();
    await expect(pharaohWord).toBeVisible();
    await pharaohWord.click();

    // 3. User MUST be automatically transitioned to the Map tab (NOT hijacked to Word Inspector)
    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapContent).toBeVisible();
    await expect(wordContent).toBeHidden();

    // 4. Map title reflects Genesis 47
    const title = page.locator('#companion-map-title');
    await expect(title).toContainText('Genesis 47');

    // 5. Must NOT display 550 BC Nabonidus Cylinder on Genesis 47 map
    const nabonidusLabel = page.locator('.gold-coin-label', { hasText: 'Nabonidus' });
    await expect(nabonidusLabel).toHaveCount(0);

    // 6. Companion drawer below map displays Pharaoh, Egypt, approx year, region of power, allies, and path
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText(/Pharaoh/i);
    await expect(drawer).toContainText(/Egypt/i);
    await expect(drawer).toContainText(/1876|1800|Middle Kingdom/i);
    await expect(drawer).toContainText(/Region of Power/i);
    await expect(drawer).toContainText(/Allies/i);

    // 7. Luminous focus pin is rendered on the map
    const focusPin = page.locator('.leaflet-geo-focus-marker');
    await expect(focusPin).toBeVisible();

    // 8. Clicking a generic non-entity word like "shepherds" while on Map tab does NOT hijack to Word Inspector
    const shepherdsWord = page.locator('.bible-verse-row[data-verse="3"] .kjv-word[data-word="shepherds"]').first();
    await expect(shepherdsWord).toBeVisible();
    await shepherdsWord.click();

    // Still on Map tab!
    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapContent).toBeVisible();

    // Word inspector tab shows dot indicator
    await expect(wordTabBtn.locator('.tab-word-indicator')).toBeVisible();

    // 9. Right-clicking "shepherds" explicitly opens Word Inspector
    await shepherdsWord.click({ button: 'right' });
    await expect(wordTabBtn).toHaveClass(/active/);
    await expect(wordContent).toBeVisible();
    await expect(wordContent).toContainText('SHEPHERDS');
  });
});
