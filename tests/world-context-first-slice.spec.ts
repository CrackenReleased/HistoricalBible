import { test, expect } from '@playwright/test';

test.describe('Historical World Context - First Slice (2 Kings 18:13)', () => {
  test('Bible Reader displays time-specific relationship, independent world horizon, and map link', async ({ page }) => {
    // 1. Navigate to 2 Kings 18:13 in Bible reader
    await page.goto('/bible?book=2Kgs&chapter=18&verse=13', { waitUntil: 'networkidle' });

    // 2. Open Chrono companion tab
    const chronoTabBtn = page.locator('#companion-tab-chrono-btn');
    await expect(chronoTabBtn).toBeVisible();
    await chronoTabBtn.click();

    const chronoContent = page.locator('#companion-tab-chrono-content');
    await expect(chronoContent).toBeVisible();

    // 3. Verify How this passage is dated
    await expect(chronoContent).toContainText('HOW THIS PASSAGE IS DATED');
    await expect(chronoContent).toContainText('Taylor Prism');

    // 4. Verify Time-Specific Relationship Card (Work Package C)
    const relCard = chronoContent.locator('.reviewed-relationship-card');
    await expect(relCard).toBeVisible();
    await expect(relCard).toContainText('RELATIONSHIP AT THIS TIME');
    await expect(relCard).toContainText('Kingdom of Judah ↔ Neo-Assyrian Empire');
    await expect(relCard).toContainText('Armed conflict, siege, and coerced tribute following rebellion');
    await expect(relCard).toContainText('Hezekiah rebelled against Assyrian vassalage');
    await expect(relCard).toContainText('like a bird in a cage');
    await expect(relCard).toContainText('Tension & Limits:');

    // 5. Verify Elsewhere in the World Contemporary Horizon (Work Package D)
    const worldCard = chronoContent.locator('.reviewed-world-horizon-card');
    await expect(worldCard).toBeVisible();
    await expect(worldCard).toContainText('ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON');
    await expect(worldCard).toContainText('Eastern Zhou Dynasty');
    await expect(worldCard).toContainText('Luoyang');
    await expect(worldCard).toContainText('Spring and Autumn Annals (Chunqiu) & Zuo Zhuan');

    // 6. Switch to Map tab and verify link to Full Atlas with passage and site
    const mapTabBtn = page.locator('#companion-tab-map-btn');
    await mapTabBtn.click();
    const fullLink = page.locator('#companion-map-full-link');
    await expect(fullLink).toBeVisible();
    const href = await fullLink.getAttribute('href');
    expect(href?.toLowerCase()).toContain('ref=2kgs.18.13');
    expect(href).toContain('site=taylor-prism');
  });

  test('Map page carries passage context, renders relationship, and independent world horizon', async ({ page }) => {
    // Navigate directly with ref and site
    await page.goto('/map?ref=2Kgs.18.13&site=taylor-prism', { waitUntil: 'networkidle' });

    // Verify detail drawer opens for Taylor Prism
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Taylor Prism');

    // Verify time-specific relationship card inside drawer
    const drawerRel = page.locator('#drawer-relationship');
    await expect(drawerRel).toBeVisible();
    await expect(drawerRel).toContainText('RELATIONSHIP AT THIS TIME');
    await expect(drawerRel).toContainText('Kingdom of Judah ↔ Neo-Assyrian Empire');
    await expect(drawerRel).toContainText('Hezekiah rebelled against Assyrian vassalage');

    // Verify independent world horizon card inside drawer
    const drawerWorld = page.locator('#drawer-world-item');
    await expect(drawerWorld).toBeVisible();
    await expect(drawerWorld).toContainText('ELSEWHERE IN THE WORLD · CONTEMPORARY HORIZON');
    await expect(drawerWorld).toContainText('Eastern Zhou Dynasty');

    // Verify Pan to China button is clickable
    const panBtn = page.locator('#drawer-pan-world-btn');
    await expect(panBtn).toBeVisible();
    await panBtn.click();

    // Verify reading context return bar exists and points to Bible
    const contextBar = page.locator('#atlas-context-bar');
    await expect(contextBar).toBeVisible();
    const returnLink = page.locator('#atlas-context-bible');
    await expect(returnLink).toBeVisible();
    const returnHref = await returnLink.getAttribute('href');
    expect(returnHref).toContain('/bible?ref=2Kgs.18.13');
  });
});
