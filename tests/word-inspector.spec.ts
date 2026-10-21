import { test, expect } from '@playwright/test';

test.describe('Bible Word Inspector & Modern Meaning', () => {
  test('inspecting "without" in Genesis 1:2 displays definition and avoids a false Hebrew alignment', async ({ page }) => {
    // Navigate directly to Genesis 1 with word=without and tab=word
    await page.goto('/bible?book=Genesis&chapter=1&word=without&tab=word', { waitUntil: 'networkidle' });

    // 1. Assert Word Inspector tab is active and visible
    const wordTabBtn = page.locator('#companion-tab-word-btn');
    await expect(wordTabBtn).toHaveClass(/active/);
    const wordContent = page.locator('#companion-tab-word-content');
    await expect(wordContent).toBeVisible();

    // 2. Assert Title sits directly at the top with no redundant eyebrow or badge row
    await expect(wordContent.locator('.word-inspect-name')).toHaveText('WITHOUT');
    await expect(wordContent.locator('.word-inspect-card .eyebrow')).toHaveCount(0);
    await expect(wordContent.locator('.word-badge-row')).toHaveCount(0);

    // 3. Assert Word Definition is populated (not empty)
    const defSection = wordContent.locator('.word-inspect-section').nth(0);
    await expect(defSection.locator('.word-section-title')).toHaveText('WORD DEFINITION');
    await expect(defSection.locator('.word-section-body')).toContainText('without form');

    // 4. English word is not falsely assigned one Hebrew token for the whole phrase.
    const originSection = wordContent.locator('.word-inspect-section').nth(1);
    await expect(originSection).toContainText('not aligned to a specific Hebrew or Greek token');
    await expect(originSection).not.toContainText('H8414');

    // 5. Assert Modern Meaning is explicitly labeled and displayed
    const modernSection = wordContent.locator('.word-section-modern');
    await expect(modernSection.locator('.word-section-title')).toContainText('MODERN MEANING');
    await expect(modernSection.locator('.modern-meaning-text')).toContainText('without form');

    // 6. Assert Concordance Occurrences
    const concordanceList = wordContent.locator('.concordance-verses-list');
    await expect(concordanceList).toBeVisible();
    await expect(concordanceList.locator('.concordance-verse-item')).not.toHaveCount(0);

    // 7. Verify bridge link is updated from "Study Desk" to "Interact"
    const xrefsTabBtn = page.locator('#companion-tab-xrefs-btn');
    await xrefsTabBtn.click();
    const verseRow = page.locator('.bible-verse-row[data-verse="2"]');
    await verseRow.click();
    await expect(page.locator('#companion-tab-xrefs-content')).toContainText('Open in Interact');
    await expect(page.locator('#companion-tab-xrefs-content')).not.toContainText('Open Study Desk');
  });

  test('clicking the reviewed Spirit occurrence in Genesis 1:2 shows its source-linked lemma', async ({ page }) => {
    await page.goto('/bible?ref=Gen.1.2', { waitUntil: 'networkidle' });
    await page.locator('.bible-verse-row[data-verse="2"] .kjv-word[data-word="spirit"]').click();
    await page.locator('#companion-tab-word-btn').click();

    const wordContent = page.locator('#companion-tab-word-content');
    await expect(wordContent).toBeVisible();

    // Verify Title is SPIRIT at the top, no eyebrow, no badge row
    await expect(wordContent.locator('.word-inspect-name')).toHaveText('SPIRIT');
    await expect(wordContent.locator('.word-inspect-card .eyebrow')).toHaveCount(0);
    await expect(wordContent.locator('.word-badge-row')).toHaveCount(0);

    // Verify Untranslated Word & Origin has Strong's H7307 and lemma
    const originSection = wordContent.locator('.word-inspect-section').nth(1);
    await expect(originSection).toContainText('H7307');
    await expect(originSection).toContainText('רוּחַ');

    // Modern Meaning
    const modernSection = wordContent.locator('.word-section-modern');
    await expect(modernSection.locator('.word-section-title')).toContainText('MODERN MEANING');
  });

});

test('supplied words and divine-name casing never inherit an unverified original-language token', async ({ page }) => {
  await page.goto('/bible?book=Genesis&chapter=1');
  await page.locator('.bible-verse-row[data-verse="2"] .kjv-italics .kjv-word[data-word="was"]').click();
  await page.locator('#companion-tab-word-btn').click();
  await expect(page.locator('#companion-tab-word-content')).toContainText('Translator-supplied English');
  await expect(page.locator('#companion-tab-word-content')).not.toContainText('Strong’s');
  await page.goto('/bible?book=Exodus&chapter=4');
  await page.locator('.bible-verse-row[data-verse="10"] .kjv-divine-name .kjv-word').first().click();
  await page.locator('#companion-tab-word-btn').click();
  await expect(page.locator('#companion-tab-word-content')).toContainText('LORD');
  await page.locator('.bible-verse-row[data-verse="10"] .kjv-word').filter({ hasText: /^Lord$/ }).last().click();
  await expect(page.locator('#companion-tab-word-content')).toContainText('Lord');
  await expect(page.locator('#companion-tab-word-content')).toContainText('not aligned to a specific Hebrew or Greek token');
});
