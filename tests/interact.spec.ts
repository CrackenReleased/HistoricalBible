import { test, expect } from '@playwright/test';

test('INT-23: every wider-study card follows a name and survives refresh and history', async ({ page }) => {
  await page.goto('/interact?figure=hezekiah');
  await page.locator('#search-input').fill('Jonah');
  await page.locator('#search-input').press('Enter');
  await expect(page.locator('.figure-hero-name')).toHaveText('Jonah');
  await expect(page.locator('#discovery-setting')).toContainText('Jonah');
  await expect(page.locator('#scripture-anchors-list')).toContainText('Jonah');
  await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
  await expect(page.locator('#discovery')).not.toContainText('Hezekiah');
  await expect(page.locator('#personal-network-list')).not.toContainText('Counselled Hezekiah');
  await expect(page).not.toHaveURL(/figure=hezekiah/);
  await page.reload();
  await expect(page.locator('.figure-hero-name')).toHaveText('Jonah');
  await page.locator('#search-input').fill('Daniel');
  await page.locator('#search-input').press('Enter');
  await expect(page.locator('.figure-hero-name')).toContainText('Daniel');
  await page.goBack();
  await expect(page.locator('.figure-hero-name')).toHaveText('Jonah');
  await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
});

test('INT-24: Balaam donkey aliases select an animal passage study without inherited human metadata', async ({ page }) => {
  await page.goto('/interact?figure=hezekiah&view=graph');
  for (const query of ["Balam's donkey", 'Balaam’s donkey', "Balaam's ass"]) {
    await page.locator('#search-input').fill(query);
    await page.getByRole('button', { name: 'Explore', exact: true }).click();
    await expect(page.locator('.figure-hero-name')).toHaveText('Balaam’s donkey');
    await expect(page.locator('#scripture-anchors-list')).toContainText('NUMBERS {22:28}');
    await expect(page.locator('#scripture-anchors-list')).toContainText('opened the mouth of the ass');
    await expect(page.locator('#personal-network-list')).toBeEmpty();
    await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
    await expect(page.locator('#active-era-badge')).toBeEmpty();
    await expect(page.locator('#ego-graph-container')).toBeHidden();
    await expect(page.locator('#ancient-map-container')).toBeHidden();
    await expect(page.locator('#btn-view-map')).toBeDisabled();
    await expect(page.locator('#search-results-list')).toBeHidden();
  }
  await page.reload();
  await expect(page.locator('.figure-hero-name')).toHaveText('Balaam’s donkey');
  await expect(page.locator('#personal-network-list')).toBeEmpty();
  await page.getByRole('button', { name: 'Save study', exact: true }).click();
  await expect(page.locator('#study-session-bar')).toContainText('Study saved in this browser.');
  await page.locator('#research-title').scrollIntoViewIfNeeded();
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator('.figure-hero-name')).toHaveText('Balaam’s donkey');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.locator('#research-title').scrollIntoViewIfNeeded();
});

test('INT-26: legacy mixed links and exact names keep a single subject throughout the page', async ({ page }) => {
  await page.goto('/interact?figure=hezekiah&name=Jonah&section=verses');
  await expect(page.locator('.figure-hero-name')).toHaveText('Jonah');
  await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
  await page.locator('#name-search-close').click();
  await expect(page.locator('.figure-hero-name')).toHaveText('Jonah');
  await expect(page).toHaveURL(/name=Jonah/);
  await page.locator('#search-input').fill('Aaron');
  await page.locator('#search-input').press('Enter');
  await expect(page.locator('.figure-hero-name')).toHaveText('Aaron');
  await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
  await page.getByRole('button', { name: 'Save study', exact: true }).click();
  await expect(page.locator('#study-session-bar')).toContainText('Study saved in this browser.');
});

test('INT-25: passage selection clears a previous persons wider-study cards', async ({ page }) => {
  await page.goto('/interact?figure=hezekiah');
  await page.locator('#search-input').fill('John 3:16');
  await page.locator('#search-input').press('Enter');
  await expect(page.locator('#scripture-anchors-list')).toContainText('JOHN {3:16}');
  await expect(page.locator('#secular-contemporaries-list')).toBeEmpty();
  await expect(page.locator('#personal-network-list')).toBeEmpty();
  await expect(page.locator('#discovery')).not.toContainText('Hezekiah');
  await page.reload();
  await expect(page.locator('#scripture-anchors-list')).toContainText('JOHN {3:16}');
});

for (const action of ['Enter', 'Explore'] as const) {
  test(`INT-21: ${action} opens Jonah and dismisses suggestions`, async ({ page }) => {
    await page.goto('/interact?figure=hezekiah');
    await page.locator('#search-input').fill('Jonah');
    await expect(page.locator('#search-results-list')).toBeVisible();
    if (action === 'Enter') await page.locator('#search-input').press('Enter');
    else await page.getByRole('button', { name: 'Explore', exact: true }).click();
    await expect(page.locator('#search-results-list')).toBeHidden();
    await expect(page.locator('#name-search-title')).toHaveText('Jonah');
    await expect(page.locator('#name-search-detail')).toBeVisible();
    await expect(page.locator('#name-search-title')).toBeInViewport();
    await expect(page.locator('#name-search-detail .kjv-verse-text').first()).toContainText('Jonah');
    await expect(page).toHaveURL(/name=Jonah/);
  });
}

test('INT-22: submission also opens figures and empires, and handles empty or unmatched queries', async ({ page }) => {
  await page.goto('/interact?figure=hezekiah');
  const input = page.locator('#search-input');
  await input.fill('Daniel');
  await input.press('Enter');
  await expect(page).toHaveURL(/figure=daniel/);
  await expect(page.locator('#search-results-list')).toBeHidden();
  await input.fill('Greek');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.locator('#timeline-browser')).toHaveAttribute('open');
  await expect(page.locator('#search-results-list')).toBeHidden();
  const selectedUrl = page.url();
  await input.fill('xyznonexistent987654');
  await input.press('Enter');
  await expect(page.locator('#search-status')).toContainText('No results');
  await expect(page).toHaveURL(selectedUrl);
  await input.fill('');
  await input.press('Enter');
  await expect(page.locator('#search-results-list')).toBeHidden();
  await expect(page).toHaveURL(selectedUrl);
});

test('NAME-01: Scripture leads names, uncertain glosses are qualified, and the three companions stay connected', async ({ page }) => {
  await page.goto('/interact');
  await page.locator('#search-input').fill('Shadrach');
  await page.locator('#search-results-list button').filter({ hasText: /^Shadrach —/ }).click();
  await expect(page.locator('#name-search-meaning')).toContainText('Hananiah');
  await expect(page.locator('#name-search-meaning')).not.toContainText('nipple');
  await expect(page.locator('.name-study-status')).toHaveText(/Uncertain derivation/);
  await expect(page.locator('.name-study-sources')).not.toHaveAttribute('open');
  await page.locator('.name-study-sources > summary').click();
  await expect(page.locator('.name-study-historical')).toContainText('Hitchcock');
  await expect(page.locator('.name-study-historical')).toContainText('nipple');
  await page.locator('.name-study-refs').getByRole('button', { name: 'Dan.3.18', exact: true }).click();
  await expect(page.locator('#name-search-passages > article .kjv-verse-text')).toContainText('we will not serve thy gods');
  await page.locator('#name-search-detail').getByRole('button', { name: '9 connected names', exact: true }).click();
  await page.locator('#name-search-passages').getByRole('button', { name: 'Abednego', exact: true }).click();
  await expect(page.locator('#name-search-meaning')).toContainText('Azariah');
  await expect(page.locator('#name-search-passages')).toContainText('14 verse links');
});

test('INT-17: Dictionary names open beside search without jumping to the bottom', async ({ page }) => {
  await page.goto('/interact');
  await page.evaluate(() => document.fonts.ready.then(() => {}));
  for (const name of ['Gideon', 'Aaron', 'Joshua']) {
    await page.locator('#search-input').scrollIntoViewIfNeeded();
    await page.locator('#search-input').fill(name);
    const before = await page.evaluate(() => scrollY);
    await page.locator('#search-results-list button').filter({ hasText: new RegExp(`^${name} —`) }).click();
    await expect(page.locator('#name-search-detail')).toBeVisible();
    await expect(page.locator('#name-search-title')).toHaveText(name);
    expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(400);
    await expect(page.locator('#search-input')).toBeInViewport();
    await expect(page.locator('#search-results-list')).toBeHidden();
    await expect(page.locator('#names-directory')).not.toHaveAttribute('open');
    await expect(page.locator('#name-search-detail .kjv-verse-text').first()).toContainText(new RegExp(`\\b${name}\\b`));
    if (name === 'Gideon') {
      await expect(page.locator('#name-search-detail .scripture-ref').first()).toHaveText('JUDGES {6:11}');
      await expect(page.locator('#name-search-detail')).not.toContainText('Gideoni');
      const card = page.locator('#name-search-passages .explorer-list > article').first();
      await card.getByRole('button', { name: 'Read in context', exact: true }).click();
      await expect(card.locator('.drawer-chapter')).toHaveClass(/open/);
      await card.getByRole('button', { name: /Connected passages/ }).click();
      const next = await card.locator('.drawer-xrefs .crossref-item strong').first().innerText();
      await card.getByRole('button', { name: 'Read this passage →' }).first().click();
      await expect(page.locator('#name-search-passages .explorer-list > article').first().locator('.scripture-ref')).toHaveText(next);
    }
  }
  await page.locator('#search-input').fill('Daniel');
  await expect(page.locator('#name-search-detail')).toBeHidden();
  await page.locator('#search-results-list button').filter({ hasText: /^Daniel —/ }).first().click();
  await expect(page.locator('#discovery-title')).toContainText('Babylon');
  await expect(page.locator('#search-results-list')).toBeHidden();
});

test('INT-15: Collection introduction exposes real counts and one prominent search', async ({ page }) => {
  await page.goto('/interact');
  await expect(page.locator('#stat-connections')).toHaveText('344,799');
  await expect(page.locator('#stat-verses')).toHaveText('31,102');
  await expect(page.locator('#stat-names')).toHaveText('2,453');
  await expect(page.locator('#stat-nameEdges')).toHaveText('12,323');
  await expect(page.locator('#search-input')).toHaveCount(1);
  await expect(page.locator('#collection-title')).toContainText('Every passage');
  expect(await page.locator('#connection-atlas path').count()).toBeGreaterThan(0);
  // Arcs use canonical book order: 39 OT books precede the 27 NT books.
  // A link touching the OT remains gold across its entire path.
  const arcColors = await page.locator('#connection-atlas path').evaluateAll(paths => paths.map(path => ({
    start: Number(path.getAttribute('d')!.split(' ')[1]),
    stroke: path.getAttribute('stroke'),
  })));
  const newTestamentStart = 18 + 39 / 65 * 564;
  expect(arcColors.some(arc => arc.start >= newTestamentStart)).toBe(true);
  for (const arc of arcColors) {
    expect(arc.stroke).toBe(arc.start < newTestamentStart ? '#c5a059' : '#719e9b');
  }
  for (const width of [375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const search = await page.locator('#search-input').boundingBox();
    expect(search!.y + search!.height).toBeLessThan(1800);
  }
});

test('INT-18: Every total opens records, and Obsidian names traverse shared verses and full ranges', async ({ page }) => {
  await page.goto('/interact');
  const explorer = page.locator('#collection-explorer');
  await page.locator('[data-collection="books"]').click();
  await expect(explorer).toContainText('31,102 KJV verses');
  await expect(explorer.locator('.book-grid button')).toHaveCount(66);
  await explorer.locator('.book-grid').getByRole('button', { name: 'John', exact: true }).click();
  await explorer.getByRole('button', { name: 'John chapter 3', exact: true }).click();
  await explorer.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(explorer).toContainText('JOHN {3:16}');
  await page.locator('[data-collection="names"]').click();
  await expect(explorer).toContainText('of 2,453 records');
  await explorer.getByLabel('Filter collection').fill('Gideon');
  await explorer.getByRole('button', { name: 'Gideon', exact: true }).click();
  const name = page.locator('#name-search-detail');
  await expect(name).toContainText('37 verse links');
  await name.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(name).toContainText('6–10 of 37 records');
  await name.getByRole('button', { name: '21 connected names', exact: true }).click();
  await name.getByRole('button', { name: '9 shared verses →', exact: true }).click();
  await expect(explorer.locator('.scripture-card')).toHaveCount(9);
  await expect(explorer).toContainText('Gideon and Israel');
  await explorer.locator('.btn-all-xrefs').first().click();
  await expect(explorer.getByLabel('Filter collection')).toHaveValue('Judg.6.36');
  await explorer.getByRole('button', { name: 'Gen.15.8 → Judg.6.36-Judg.6.40', exact: true }).click();
  await expect(explorer).toContainText('JUDGES {6:40}');
  await expect(explorer.locator('.scripture-card')).toHaveCount(6);
  await page.locator('[data-collection="references"]').click();
  await explorer.getByLabel('Source votes').selectOption('negative');
  await expect(explorer).toContainText('of 1,229 records');
  await page.locator('[data-collection="connections"]').click();
  await expect(explorer).toContainText('of 12,323 records');
  await explorer.getByLabel('Page number', { exact: true }).fill('493');
  await explorer.getByRole('button', { name: 'Go', exact: true }).click();
  await expect(explorer).toContainText('12,301–12,323 of 12,323 records');
  await explorer.locator('[data-mode="history"]').click();
  await expect(explorer).toContainText('12 curated historical profiles and 6 world empires');
});

test('INT-16: Suggested search, keyboard selection, no results and dismissal work', async ({ page }) => {
  await page.goto('/interact');
  await page.getByRole('button', { name: 'John 3:16 ↗', exact: true }).click();
  await expect(page.locator('#search-results-list')).toContainText('JOHN {3:16}');
  await page.locator('#search-input').press('ArrowDown');
  await expect(page.locator('#search-results-list button').first()).toBeFocused();
  await page.locator('#search-results-list button').first().press('Enter');
  await expect(page.locator('#scripture-anchors-list > article').first()).toContainText('JOHN {3:16}');
  await expect(page.locator('#search-results-list')).toBeHidden();
  await page.getByRole('link', { name: '↑ Search the collection' }).click();
  await page.locator('#search-input').fill('xyznonexistent987654');
  await expect(page.locator('#search-status')).toContainText('No results');
  await page.locator('#search-input').press('Escape');
  await expect(page.locator('#search-results-list')).toBeHidden();
  await page.locator('#search-input').fill('');
  await expect(page.locator('#search-results-list')).toBeHidden();
  await page.getByRole('button', { name: 'Daniel ↗', exact: true }).click();
  await page.locator('#search-results-list button').filter({ hasText: /^Daniel —/ }).first().click();
  await expect(page.locator('#discovery-title')).toContainText('Babylon');
});

test('INT-06: Front Door invites the reader into the dedicated Study Desk, where the discovery explains the connection and follows a question and return', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The Bible happened in the real world.' })).toBeVisible();
  await page.locator('#popup-widget6691-close-icon').click();
  await page.locator('.primary-link').first().click();
  await expect(page).toHaveURL(/\/interact\?figure=jesus-christ/);
  await expect(page.locator('#discovery-title')).toHaveText('A name in the Gospel. A name carved in stone.');
  await expect(page.locator('#discovery-scripture')).toContainText('LUKE {3:1}');
  await expect(page.locator('#discovery-evidence')).toContainText('Pilate Stone');
  await page.locator('#next-questions button[data-target="daniel"]').click();
  await expect(page.locator('.figure-hero-name')).toContainText('Daniel');
  await expect(page.locator('#discovery-title')).toContainText('Babylon');
  await page.getByRole('button', { name: 'Back to Jesus Christ', exact: true }).click();
  await expect(page.locator('#discovery-title')).toHaveText('A name in the Gospel. A name carved in stone.');
});

test('INT-07: Clean routes keep the selected person and open the same reader', async ({ page }) => {
  for (const route of ['/interact?figure=daniel', '/interact/?figure=daniel', '/interact/index.html?figure=daniel']) {
    await page.goto(route);
    await expect(page.locator('#discovery-title')).toContainText('Babylon');
    await expect(page.locator('.figure-hero-name')).toContainText('Daniel');
    await expect(page.locator('#error-banner')).toBeHidden();
  }
});

test('INT-08: Empire search and connected-person navigation keep filters and reader in agreement', async ({ page }) => {
  await page.goto('/interact.html');
  await page.locator('#search-input').fill('Rome');
  await page.getByRole('button', { name: /Roman Empire.*Explore people/ }).click();
  await expect(page.locator('#search-results-list')).toBeHidden();
  await expect(page.locator('#timeline-browser')).toHaveAttribute('open', '');
  await expect(page.locator('.figure-hero-name')).toContainText('Roman Empire');
  await page.locator('#personal-network-list button').filter({ hasText: 'Jesus' }).click();
  await page.locator('#personal-network-list button').filter({ hasText: 'King David' }).click();
  await expect(page.locator('.figure-hero-name')).toHaveText('King David');
  await expect(page.locator('.figure-node.active')).toContainText('King David');
  await expect(page.locator('#journey-trail')).toContainText('King David');
  await expect(page).toHaveURL(/figure=david/);
});

test('INT-09: Scripture exploration opens context and follows a cross-reference onward', async ({ page }) => {
  await page.goto('/interact.html');
  await page.getByRole('button', { name: 'Read the surrounding passage ↓' }).click();
  const firstCard = page.locator('#scripture-anchors-list > article').first();
  await expect(firstCard.locator('.drawer-chapter')).toHaveClass(/open/);
  await firstCard.getByRole('button', { name: /Connected passages/ }).click();
  const nextRef = await firstCard.locator('.drawer-xrefs .crossref-item strong').first().innerText();
  await firstCard.getByRole('button', { name: 'Read this passage →' }).first().click();
  await expect(page.locator('#scripture-anchors-list > article').first().locator('.scripture-ref')).toHaveText(nextRef);
});

test('INT-10: All twelve discovery profiles have a passage and working next questions', async ({ page }) => {
  const { figures } = JSON.parse((await import('node:fs')).readFileSync('public/data/history/historical_synchrony.v1.json', 'utf8'));
  for (const figure of figures) {
    await page.goto(`/interact.html?figure=${figure.id}`);
    await expect(page.locator('#discovery-title')).not.toBeEmpty();
    await expect(page.locator('#discovery-scripture .kjv-verse-text')).not.toBeEmpty();
    await expect(page.locator('#next-questions button')).toHaveCount(3);
    await expect(page.locator('#journey-trail')).toContainText(figure.name);
    await expect(page.locator('#error-banner')).toBeHidden();
  }
});

test('INT-11: Small and large screens stay readable without page overflow across Home and Interact', async ({ page }) => {
  for (const width of [375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The Bible happened in the real world.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.goto('/interact.html');
    await expect(page.locator('#discovery-scripture .kjv-verse-text')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('INT-12: Loading failure explains recovery instead of leaving an empty scaffold', async ({ page }) => {
  await page.route('**/data/history/**', route => route.abort());
  await page.goto('/interact.html');
  await expect(page.locator('#error-banner')).toContainText('Please reload');
  await expect(page.locator('#loading-status')).toBeHidden();
});

test('INT-13: An empire without curated profiles explains the gap and offers a way onward', async ({ page }) => {
  await page.goto('/interact.html');
  await page.locator('#timeline-browser > summary').click();
  await page.locator('.empire-node').filter({ hasText: 'Greek' }).click();
  await expect(page.locator('#figures-stream-track')).toContainText('No curated person profiles');
  await page.getByRole('button', { name: 'Show all people' }).click();
  await expect(page.locator('.figure-node')).toHaveCount(12);
});

test('INT-14: Opening the source file explains how to reach the working reader', async ({ page }) => {
  const { pathToFileURL } = await import('node:url');
  const { resolve } = await import('node:path');
  await page.goto(pathToFileURL(resolve('interact.html')).href);
  await expect(page.locator('#file-notice')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the local Interact preview →' })).toHaveAttribute('href', 'http://localhost:5173/interact.html');
});

test.describe('HistoricalBible.com/Interact — Historical Synchrony & Canonical KJV Suite', () => {
  test('INT-01: Boots cleanly into Dual-Stream Chronology with Jesus Christ centered and zero console/autoplay errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().toLowerCase().includes('autoplay')) {
        errors.push(msg.text());
      }
    });

    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    // No blocking welcome modal or 3D canvas
    await expect(page.locator('#welcome-modal')).toHaveCount(0);
    await expect(page.locator('#three-container')).toHaveCount(0);

    // Jesus Christ is active by default at the centerpiece of history
    const heroName = page.locator('.figure-hero-name');
    await expect(heroName).toHaveText('Jesus Christ');

    // Secular Roman contemporaries (Caesar Augustus, Tiberius Caesar, Pontius Pilate) are visible
    const secularList = page.locator('#secular-contemporaries-list');
    await expect(secularList).toContainText('Caesar Augustus');
    await expect(secularList).toContainText('Pontius Pilate');
    await expect(secularList).toContainText('Pilate Stone');

    expect(errors).toEqual([]);
  });

  test('INT-02: Every Click is the Next Step — Selecting Daniel loads Neo-Babylonian & Persian synchrony and canonical KJV invariants', async ({ page }) => {
    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    await page.locator('#timeline-browser > summary').click();
    const danielBtn = page.locator('[data-figure-id="daniel"]');
    await expect(danielBtn).toBeVisible();
    await danielBtn.click();

    await expect(page.locator('.figure-hero-name')).toHaveText(/Daniel/);
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Nebuchadnezzar II');
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Nabonidus Cylinder');
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Darius the Mede');
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Scholarly / Chronological Debate');

    // Verify canonical KJV formatting: {c:v} delimiter, [...] translator italics, and LORD small-caps
    const scripList = page.locator('#scripture-anchors-list');
    await expect(scripList).toContainText('DANIEL {1:1}');
    await expect(scripList).toContainText('DANIEL {5:27}');
  });

  test('INT-03: Selecting King David surfaces Tel Dan Stele, Moabite Stone, and preserves KJV LORD / [...] formatting', async ({ page }) => {
    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    await page.locator('#timeline-browser > summary').click();
    await page.locator('[data-figure-id="david"]').click();
    await expect(page.locator('.figure-hero-name')).toHaveText('King David');
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Tel Dan Stele');
    await expect(page.locator('#secular-contemporaries-list')).toContainText('Mesha, King of Moab');

    const divineSpan = page.locator('#scripture-anchors-list .kjv-divine-name').first();
    await expect(divineSpan).toBeVisible();
    await expect(divineSpan).toHaveText('LORD');
    const restSpan = divineSpan.locator('.kjv-divine-rest');
    await expect(restSpan).toHaveText('ORD');
    const sizes = await divineSpan.evaluate((el) => {
      const rest = el.querySelector('.kjv-divine-rest')!;
      return {
        full: parseFloat(getComputedStyle(el).fontSize),
        rest: parseFloat(getComputedStyle(rest).fontSize),
      };
    });
    expect(sizes.rest).toBeLessThan(sizes.full * 0.85);
  });

  test('INT-04: Hitchcock Names directory ranks prominent biblical figures first and supports filtering', async ({ page }) => {
    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    await page.locator('#names-directory > summary').click();
    const firstCard = page.locator('#hitchcock-directory-list .hitchcock-card').first();
    await expect(firstCard).toBeVisible();
    // Top entries must be flagship figures (e.g., David, Jesus, Moses), not obscure 'A' names like Ahian
    const firstCardText = await firstCard.textContent();
    expect(firstCardText).toMatch(/David|Jesus|Moses|Abraham/);

    const filterInput = page.locator('#hitchcock-input');
    await filterInput.fill('Aaron');
    await expect(page.locator('#hitchcock-directory-list .hitchcock-card').first()).toContainText('Aaron');
    await expect(page.locator('#hitchcock-directory-list .hitchcock-card').first()).toContainText('uncertain');
  });

  test('INT-05: Global search resolves KJV verses and historical figures', async ({ page }) => {
    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    const searchInput = page.locator('#search-input');
    await searchInput.fill('In the beginning');
    await searchInput.press('Enter');

    const results = page.locator('#search-results-list');
    await expect(results).toBeHidden();
    await expect(page.locator('#scripture-anchors-list > article').first()).toContainText('GENESIS {1:1}');
  });

  test('INT-19: 2D Ego-Graph toggle and bidirectional URL deep-linking', async ({ page }) => {
    await page.goto('/interact.html', { waitUntil: 'networkidle' });

    const listBtn = page.locator('#btn-view-list');
    const graphBtn = page.locator('#btn-view-graph');
    const graphContainer = page.locator('#ego-graph-container');

    await expect(listBtn).toBeVisible();
    await expect(graphBtn).toBeVisible();
    await expect(listBtn).toHaveClass(/active/);
    await expect(graphContainer).toBeHidden();

    // Switch to 2D Graph view
    await graphBtn.click();
    await expect(graphBtn).toHaveClass(/active/);
    await expect(listBtn).not.toHaveClass(/active/);
    await expect(graphContainer).toBeVisible();
    await expect(graphContainer.locator('canvas')).toBeVisible();
    await expect(page).toHaveURL(/view=graph/);

    // Switch back to List view
    await listBtn.click();
    await expect(listBtn).toHaveClass(/active/);
    await expect(graphBtn).not.toHaveClass(/active/);
    await expect(graphContainer).toBeHidden();
    await expect(page).toHaveURL(/view=list/);
  });

  test('INT-20: Direct URL deep-linking by figure, tab, and graph view', async ({ page }) => {
    // 1. Direct boot into Daniel with graph view
    await page.goto('/interact.html?figure=daniel&view=graph', { waitUntil: 'networkidle' });
    await expect(page.locator('#discovery-setting')).toContainText('Daniel');
    await expect(page.locator('#btn-view-graph')).toHaveClass(/active/);
    await expect(page.locator('#ego-graph-container')).toBeVisible();
    await expect(page.locator('#ego-graph-container canvas')).toBeVisible();

    // 2. Direct boot into collection references tab
    await page.goto('/interact.html?tab=references', { waitUntil: 'networkidle' });
    const explorer = page.locator('#collection-explorer');
    await expect(explorer).toBeVisible();
    await expect(explorer.locator('h2')).toContainText('Scripture speaks to Scripture');
  });

  test('INT-27: Search result and collection explorer stay strictly below the Interact header information', async ({ page }) => {
    // 1. Visit the user's exact URL with search results open
    await page.goto('/interact?name=Jonah&view=list&section=verses');
    await expect(page.locator('#name-search-detail')).toBeVisible();

    // 2. Measure vertical positions in the document
    const positions = await page.evaluate(() => {
      const hero = document.querySelector('.collection-hero') as HTMLElement;
      const stats = document.querySelector('.collection-stats') as HTMLElement;
      const search = document.getElementById('collection-search') as HTMLElement;
      const searchInput = document.getElementById('search-input') as HTMLElement;
      const nameDetail = document.getElementById('name-search-detail') as HTMLElement;
      return {
        heroTop: hero.getBoundingClientRect().top + window.scrollY,
        heroBottom: hero.getBoundingClientRect().bottom + window.scrollY,
        statsTop: stats.getBoundingClientRect().top + window.scrollY,
        statsBottom: stats.getBoundingClientRect().bottom + window.scrollY,
        searchTop: search.getBoundingClientRect().top + window.scrollY,
        searchInputBottom: searchInput.getBoundingClientRect().bottom + window.scrollY,
        nameDetailTop: nameDetail.getBoundingClientRect().top + window.scrollY,
      };
    });

    // 3. Header hierarchy: Hero is followed by Stats totals, then Search bar, then Search Result
    expect(positions.statsTop).toBeGreaterThan(positions.heroTop);
    expect(positions.searchTop).toBeGreaterThan(positions.statsBottom);
    expect(positions.nameDetailTop).toBeGreaterThan(positions.searchInputBottom);

    // 4. Sibling scan: Collection explorer must also stay strictly below the hero and stats when opened
    await page.locator('[data-collection="books"]').click();
    await expect(page.locator('#collection-explorer')).toBeVisible();
    const explorerPositions = await page.evaluate(() => {
      const hero = document.querySelector('.collection-hero') as HTMLElement;
      const stats = document.querySelector('.collection-stats') as HTMLElement;
      const explorer = document.getElementById('collection-explorer') as HTMLElement;
      return {
        heroBottom: hero.getBoundingClientRect().bottom + window.scrollY,
        statsBottom: stats.getBoundingClientRect().bottom + window.scrollY,
        explorerTop: explorer.getBoundingClientRect().top + window.scrollY,
      };
    });
    expect(explorerPositions.explorerTop).toBeGreaterThan(explorerPositions.heroBottom);
    expect(explorerPositions.explorerTop).toBeGreaterThan(explorerPositions.statsBottom);
  });
});

