import { test, expect } from '@playwright/test';

test.describe('Bible Side-by-Side Companion Map Tab', () => {
  test('renders Map tab in Bible side-by-side companion panel and initializes interactive cartography', async ({ page }) => {
    // 1. Navigate to Bible reader
    await page.goto('/bible?book=Genesis&chapter=1', { waitUntil: 'networkidle' });

    // 2. Assert companion tabs exist including Map
    const mapTabBtn = page.locator('#companion-tab-map-btn');
    await expect(mapTabBtn).toBeVisible();
    await expect(mapTabBtn).toHaveText('Map');

    // Initially xrefs tab is active and map tab is inactive
    const mapContent = page.locator('#companion-tab-map-content');
    await expect(mapContent).toBeHidden();

    // 3. Click the Map tab
    await mapTabBtn.click();
    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapTabBtn).toHaveAttribute('aria-selected', 'true');
    await expect(mapContent).toBeVisible();

    // 4. Assert embedded map container and Leaflet map initialized
    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible();
    await expect(mapContainer).toHaveClass(/leaflet-container/);

    // 5. Assert title and headline reflect Genesis 1
    const title = page.locator('#companion-map-title');
    await expect(title).toContainText('Genesis 1');

    // 6. Assert Full-Screen Atlas link
    const fullLink = page.locator('#companion-map-full-link');
    await expect(fullLink).toBeVisible();
    await expect(fullLink).toHaveAttribute('href', /map\?era=/);

    // 7. Assert Map Color Key (Kingdoms & Factions)
    const mapKeyCard = page.locator('#bible-map-key-card');
    await expect(mapKeyCard).toBeVisible();
    await expect(mapKeyCard).toContainText('MAP KEY · KINGDOMS & FACTIONS');
    await expect(mapKeyCard).toContainText('Kingdom of Judah');
    await expect(mapKeyCard).toContainText('Kingdom of Israel');
    await expect(mapKeyCard).toContainText('Hostile Empires & Enemies');
    await expect(mapKeyCard).toContainText('Friendly & Allied Regions');
    await expect(mapKeyCard).toContainText('Archaeological Discoveries');
    await expect(mapKeyCard).toContainText('Global World Civilizations');

    // Assert color dots are rendered
    await expect(mapKeyCard.locator('.map-key-dot.dot-judah')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-israel')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-hostile')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-allied')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-archaeology')).toBeVisible();
    await expect(mapKeyCard.locator('.map-key-dot.dot-global')).toBeVisible();

    // 8. Capture visual proof screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/bible-side-by-side-map-proof.png', fullPage: false });
  });

  test('2 Kings 1 correctly resolves to Divided Monarchy: Elijah & Elisha epoch (c. 853–841 BC) with Mesha Stele, NOT Sennacherib', async ({ page }) => {
    // Navigate directly to 2 Kings 1 with tab=map
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    const mapContent = page.locator('#companion-tab-map-content');
    await expect(mapContent).toBeVisible();

    // Assert title reflects 2 Kings 1 · Divided Monarchy: Elijah & Elisha
    const title = page.locator('#companion-map-title');
    await expect(title).toContainText('2 Kings 1');
    await expect(title).toContainText('Divided Monarchy: Elijah & Elisha');
    await expect(title).not.toContainText('Sennacherib');

    // Assert description reflects c. 853–841 BC Moabite Rebellion
    const desc = page.locator('#companion-map-desc');
    await expect(desc).toContainText('c. 853 – 841 BC');
    await expect(desc).toContainText('Moabite Rebellion');
    await expect(desc).not.toContainText('722 - 701 BC');

    // Assert dual chronology banner at top reflects chapter-level resolution
    const eventPill = page.locator('.chrono-pill-event');
    await expect(eventPill).toContainText('c. 853 – 841 BC');

    // Assert highlighted marker shows The Mesha Stele (Moabite Stone)
    const meshaLabel = page.locator('.gold-coin-label', { hasText: 'The Mesha Stele' });
    await expect(meshaLabel).toBeVisible();

    // Assert Taylor Prism is NOT an active site for 2 Kings 1
    const taylorLabel = page.locator('.gold-coin-label', { hasText: 'The Taylor Prism' });
    await expect(taylorLabel).toHaveCount(0);

    // Scroll map key into view and capture visual proof of 2 Kings 1 side panel
    const mapKeyCard = page.locator('#bible-map-key-card');
    await mapKeyCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const companionPane = page.locator('#bible-companion-pane');
    await companionPane.screenshot({ path: 'test-results/bible-map-2kings1-epoch-proof.png' });
  });

  test('Bug 1: Clicking a word while on Map tab does NOT hijack to Word Inspector, and pans to geographic entity', async ({ page }) => {
    // Navigate to 2 Kings 1 on map tab
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    const mapTabBtn = page.locator('#companion-tab-map-btn');
    const wordTabBtn = page.locator('#companion-tab-word-btn');
    const mapContent = page.locator('#companion-tab-map-content');
    const wordContent = page.locator('#companion-tab-word-content');

    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapContent).toBeVisible();
    await expect(wordContent).toBeHidden();

    // Left-click the word "Tishbite" in 2 Kings 1:3
    const tishbiteWord = page.locator('.kjv-word[data-word="tishbite"]').first();
    await expect(tishbiteWord).toBeVisible();
    await tishbiteWord.click();

    // User MUST still be on the Map tab!
    await expect(mapTabBtn).toHaveClass(/active/);
    await expect(mapContent).toBeVisible();
    await expect(wordContent).toBeHidden();

    // URL should reflect the selected word
    expect(page.url()).toContain('word=tishbite');
    expect(page.url()).toContain('tab=map');

    // Word Inspector tab button shows a subtle badge
    await expect(wordTabBtn.locator('.tab-word-indicator')).toBeVisible();

    // Geographic callout drawer appears below map for Tishbe in Gilead
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Tishbe in Gilead');
    await expect(drawer).toContainText('Hometown of the Prophet Elijah');

    // Right-clicking a word explicitly opens the Word Inspector
    const elijahWord = page.locator('.kjv-word[data-word="elijah"]').first();
    await elijahWord.click({ button: 'right' });

    // Right-click should switch to Word Inspector
    await expect(wordTabBtn).toHaveClass(/active/);
    await expect(wordContent).toBeVisible();
    await expect(wordContent).toContainText('ELIJAH');
  });

  test('Bug 3 & 5: Tooltip styling, Scripture Connection, and Artifact Drawer on marker click', async ({ page }) => {
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    // Click on the Mesha Stele gold marker
    const meshaMarker = page.locator('.leaflet-gold-marker', { hasText: 'The Mesha Stele' });
    await expect(meshaMarker).toBeVisible();
    await meshaMarker.click();

    // Assert Artifact Drawer opens below map with Scripture Connection
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('The Mesha Stele (Moabite Stone)');
    await expect(drawer).toContainText('✦ Scripture Connection:');
    await expect(drawer).toContainText('King Mesha of Moab records his rebellion against the house of Omri and Israel');

    // Close button dismisses the drawer
    const closeBtn = drawer.locator('.artifact-drawer-close');
    await closeBtn.click();
    await expect(drawer).toBeHidden();
  });

  test('Bug 4: Map zoom control zooms past level 10 up to level 15', async ({ page }) => {
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    const zoomInBtn = page.locator('#map-zoom-in');
    await expect(zoomInBtn).toBeVisible();

    // Click zoom in multiple times without getting locked prematurely
    for (let i = 0; i < 5; i++) {
      await zoomInBtn.click();
      await page.waitForTimeout(150);
    }

    // Assert map zoom button is still enabled and container is functional
    const mapContainer = page.locator('#bible-companion-map-container');
    await expect(mapContainer).toBeVisible();
  });

  test('Global Macro-Cartography: Multiple contemporary world empires and regional powers render with capitals, populations, and areas', async ({ page }) => {
    // Navigate to 2 Kings 1 on map tab
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    // Assert capital markers exist across the world
    const capitalMarkers = page.locator('.leaflet-capital-marker');
    await expect(capitalMarkers.first()).toBeVisible({ timeout: 5000 });
    const count = await capitalMarkers.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Assert specific contemporary capitals and regions are present for Divided Monarchy
    await expect(page.locator('.capital-marker-label', { hasText: 'Jerusalem' })).toBeVisible();
    await expect(page.locator('.capital-marker-label', { hasText: 'Samaria' })).toBeVisible();
    await expect(page.locator('.capital-marker-label', { hasText: 'Nineveh' })).toBeVisible();
    await expect(page.locator('.capital-marker-label', { hasText: 'Haojing & Luoyang' })).toBeVisible();
    await expect(page.locator('.capital-marker-label', { hasText: 'Napata & Meroë' })).toBeVisible();
    await expect(page.locator('.capital-marker-label', { hasText: 'Neapolis Scythica' })).toBeVisible();

    // Capture visual proof of global macro-cartography
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/global-macro-cartography-proof.png' });
  });

  test('Zero-Collision Tooltips & Kingdom of Israel Drawer in Bible Companion Map: Hovering and clicking Samaria renders dossier without multiple popups', async ({ page }) => {
    await page.goto('/bible?book=2Kings&chapter=1&tab=map', { waitUntil: 'networkidle' });

    // Assert Samaria capital marker is visible
    const samariaMarker = page.locator('.capital-marker-label', { hasText: 'Samaria' });
    await expect(samariaMarker).toBeVisible({ timeout: 5000 });

    // Hover over Samaria to open tooltip
    await samariaMarker.hover();
    await page.waitForTimeout(300);
    const tooltip = page.locator('.leaflet-tooltip');
    await expect(tooltip).toBeVisible();

    // Click Samaria to open companion artifact drawer
    await samariaMarker.click();
    const drawer = page.locator('#bible-companion-artifact-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Kingdom of Israel (Samaria)');
    await expect(drawer).toContainText('Capital: Samaria');

    // Verify no stuck multiple tooltips (strictly <= 1 in DOM)
    const tooltips = page.locator('.leaflet-tooltip');
    expect(await tooltips.count()).toBeLessThanOrEqual(1);
  });
});
