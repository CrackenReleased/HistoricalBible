import { test, expect } from '@playwright/test';

test.describe('Biblical Chronology & Historical Integrity', () => {
  test('Genesis 1 correctly displays Creation Week c. 4004 BC and Primeval History, not 1805 BC', async ({ page }) => {
    await page.goto('/bible?book=Genesis&chapter=1', { waitUntil: 'domcontentloaded' });

    const chronoBanner = page.locator('#reader-chronology-banner');
    await expect(chronoBanner).toBeVisible();

    const eventPill = chronoBanner.locator('.chrono-pill-event');
    // Absolute requirement: Creation is c. 4004 BC, NOT 1805 BC
    await expect(eventPill).toContainText('c. 4004 BC (Creation Week)');
    await expect(eventPill).not.toContainText('1805 BC');
    await expect(eventPill).not.toContainText('Creation – c. 1805 BC');

    // Eyebrow when sorted by Event must reflect Primeval History for Gen 1-11
    const sortSelect = page.locator('#reader-sort-select');
    await sortSelect.selectOption('event');
    const eyebrow = page.locator('#reader-order-eyebrow');
    await expect(eyebrow).toContainText('PRIMEVAL HISTORY');

    // Companion Chronology tab check
    await page.locator('#companion-tab-chrono-btn').click();
    const chronoTab = page.locator('#companion-tab-chrono-content');
    await expect(chronoTab).toBeVisible();
    const eventSection = chronoTab.locator('.event-section');
    await expect(eventSection).toContainText('c. 4004 BC (Creation Week)');
    await expect(eventSection).toContainText('Primeval History');
    await expect(eventSection).toContainText('c. 4004 BC (Creation) – c. 1805 BC (Death of Joseph)');
  });

  test('Granular chapter chronology dynamically reflects eras across Genesis (Flood, Abraham, Joseph)', async ({ page }) => {
    // 1. Genesis 6 - The Great Deluge (c. 2348 BC)
    await page.goto('/bible?book=Genesis&chapter=6', { waitUntil: 'domcontentloaded' });
    const eventPillCh6 = page.locator('#reader-chronology-banner .chrono-pill-event');
    await expect(eventPillCh6).toContainText('c. 2348 – 2347 BC (The Great Deluge & Noah\'s Ark)');

    // 2. Genesis 12 - Call of Abram (c. 2091 BC)
    await page.goto('/bible?book=Genesis&chapter=12', { waitUntil: 'domcontentloaded' });
    const eventPillCh12 = page.locator('#reader-chronology-banner .chrono-pill-event');
    await expect(eventPillCh12).toContainText('c. 2091 – 2067 BC (Call of Abram & Covenant of Circumcision)');

    // 3. Genesis 50 - Joseph in Egypt & Death of Joseph (c. 1805 BC)
    await page.goto('/bible?book=Genesis&chapter=50', { waitUntil: 'domcontentloaded' });
    const eventPillCh50 = page.locator('#reader-chronology-banner .chrono-pill-event');
    await expect(eventPillCh50).toContainText('c. 1898 – 1805 BC');
  });

  test('Exodus chapter chronology distinguishes bondage/plagues from Sinai law', async ({ page }) => {
    // Exodus 1 - Bondage in Egypt
    await page.goto('/bible?book=Exodus&chapter=1', { waitUntil: 'domcontentloaded' });
    const eventPillEx1 = page.locator('#reader-chronology-banner .chrono-pill-event');
    await expect(eventPillEx1).toContainText('c. 1526 – 1446 BC');

    // Exodus 20 - Ten Commandments at Sinai
    await page.goto('/bible?book=Exodus&chapter=20', { waitUntil: 'domcontentloaded' });
    const eventPillEx20 = page.locator('#reader-chronology-banner .chrono-pill-event');
    await expect(eventPillEx20).toContainText('c. 1446 BC (Sinai Covenant & The Ten Commandments)');
  });
});
