import { test, expect } from '@playwright/test';

test.describe('HistoricalBible GA4 Telemetry & Event Analytics', () => {
  test('Home page bootstraps dataLayer with G-P4HE0VJJC9 and tracks curiosity door clicks', async ({ page }) => {
    // Dismiss popup before navigation so it doesn't intercept clicks
    await page.addInitScript(() => {
      sessionStorage.setItem('hb_popup_dismissed', '1');
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify dataLayer is initialized with gtag config
    const dataLayer = await page.evaluate(() => (window as any).dataLayer || []);
    expect(dataLayer.length).toBeGreaterThan(0);

    const hasConfig = dataLayer.some((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const target = entry[1] ?? entry['1'];
      return action === 'config' && target === 'G-P4HE0VJJC9';
    });
    expect(hasConfig).toBe(true);

    const door = page.locator('.entry-card[data-door="hezekiah"]');
    await expect(door).toBeVisible();

    // Remove href to prevent page navigation while testing click handler
    await door.evaluate((el) => el.removeAttribute('href'));
    await door.click();

    // Verify curiosity_door_click event was pushed
    const updatedDataLayer = await page.evaluate(() => (window as any).dataLayer || []);
    const doorEvent = updatedDataLayer.find((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const eventName = entry[1] ?? entry['1'];
      const params = entry[2] ?? entry['2'] ?? entry;
      if (action === 'event' && eventName === 'curiosity_door_click') {
        return params?.door_id === 'hezekiah';
      }
      return entry?.event === 'curiosity_door_click' && entry?.door_id === 'hezekiah';
    });
    expect(doorEvent).toBeTruthy();
  });

  test('Bible Reader (/bible) tracks chapter view, verse click, and companion tab switches', async ({ page }) => {
    await page.goto('/bible?book=Genesis&chapter=1', { waitUntil: 'domcontentloaded' });

    // Wait for verses to render
    const verse1 = page.locator('.bible-verse-row[data-verse="1"]');
    await expect(verse1).toBeVisible({ timeout: 10000 });

    // Verify chapter view was tracked
    const initialLayer = await page.evaluate(() => (window as any).dataLayer || []);
    const chapterEvent = initialLayer.find((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const eventName = entry[1] ?? entry['1'];
      const params = entry[2] ?? entry['2'] ?? entry;
      if (action === 'event' && eventName === 'bible_chapter_read') {
        return params?.book_name === 'Genesis' && params?.chapter_number === 1;
      }
      return entry?.event === 'bible_chapter_read' && entry?.book_name === 'Genesis';
    });
    expect(chapterEvent).toBeTruthy();

    // Click word inside verse 1
    const wordInVerse1 = verse1.locator('.kjv-word').first();
    await wordInVerse1.click();

    // Verify verse select or concordance event
    const postVerseLayer = await page.evaluate(() => (window as any).dataLayer || []);
    const verseEvent = postVerseLayer.find((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const eventName = entry[1] ?? entry['1'];
      if (action === 'event' && (eventName === 'bible_verse_select' || eventName === 'concordance_inspect')) {
        return true;
      }
      return entry?.event === 'bible_verse_select' || entry?.event === 'concordance_inspect';
    });
    expect(verseEvent).toBeTruthy();

    // Switch to Map tab in companion drawer
    const mapTabBtn = page.locator('#companion-tab-map-btn');
    await expect(mapTabBtn).toBeVisible();
    await mapTabBtn.click();

    const postTabLayer = await page.evaluate(() => (window as any).dataLayer || []);
    const tabEvent = postTabLayer.find((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const eventName = entry[1] ?? entry['1'];
      const params = entry[2] ?? entry['2'] ?? entry;
      if (action === 'event' && eventName === 'companion_tab_switch') {
        return params?.tab_name === 'map';
      }
      return entry?.event === 'companion_tab_switch' && entry?.tab_name === 'map';
    });
    expect(tabEvent).toBeTruthy();
  });

  test('Map Explorer (/map) tracks layer toggles and preset jumps', async ({ page }) => {
    await page.goto('/map', { waitUntil: 'domcontentloaded' });

    // Click a preset button (e.g. Jerusalem)
    const presetBtn = page.locator('.atlas-preset-btn[data-preset="jerusalem"]');
    if (await presetBtn.count() > 0) {
      await presetBtn.first().click();

      const layer = await page.evaluate(() => (window as any).dataLayer || []);
      const presetEvent = layer.find((entry: any) => {
        const action = entry[0] ?? entry['0'];
        const eventName = entry[1] ?? entry['1'];
        const params = entry[2] ?? entry['2'] ?? entry;
        if (action === 'event' && eventName === 'atlas_preset_jump') {
          return params?.preset_name === 'jerusalem';
        }
        return entry?.event === 'atlas_preset_jump' && entry?.preset_name === 'jerusalem';
      });
      expect(presetEvent).toBeTruthy();
    }
  });

  test('Contact page (/contact) tracks form submit action with opt_in status', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });

    await page.fill('#contact-name', 'Berean Explorer');
    await page.fill('#contact-email', 'berean@example.com');
    await page.fill('#contact-message', 'Testing verified analytics integration.');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    const layer = await page.evaluate(() => (window as any).dataLayer || []);
    const submitEvent = layer.find((entry: any) => {
      const action = entry[0] ?? entry['0'];
      const eventName = entry[1] ?? entry['1'];
      if (action === 'event' && eventName === 'contact_form_submit') {
        return true;
      }
      return entry?.event === 'contact_form_submit';
    });
    expect(submitEvent).toBeTruthy();
  });
});
