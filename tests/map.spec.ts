import { test, expect } from '@playwright/test';

test.describe('HistoricalBible Interactive Maps & Cartographic Atlas (Option C)', () => {
  test('Top navigation header includes Map link across all major routes', async ({ page }) => {
    const routes = ['/', '/bible', '/map', '/interact', '/contact'];
    for (const route of routes) {
      await page.goto(route);
      const nav = page.locator('nav.site-nav');
      await expect(nav).toBeVisible();

      const mapLink = nav.locator('a[href="/map"]');
      await expect(mapLink).toBeVisible();
      await expect(mapLink).toHaveText('Map');

      if (route === '/map') {
        await expect(mapLink).toHaveAttribute('aria-current', 'page');
      } else {
        await expect(mapLink).not.toHaveAttribute('aria-current', 'page');
      }
    }
  });

  test('Dedicated Cartographic Atlas (/map) renders 60FPS canvas, layer toggles, and region presets', async ({ page }) => {
    await page.goto('/map');
    await expect(page).toHaveTitle(/Biblical World Map/);

    // Header branding
    await expect(page.locator('header .brand-emblem')).toBeVisible();
    await expect(page.locator('header .brand-white')).toHaveText('Historical');
    await expect(page.locator('header .brand-gold')).toHaveText('Bible');

    // Atlas Title
    await expect(page.locator('#atlas-title')).toHaveText('The Biblical World in History');

    // Map container
    const canvas = page.locator('#atlas-canvas-container');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveClass(/leaflet-container/);
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(300);
    expect(box!.height).toBeGreaterThan(200);

    // Layer toggles
    const layerToggles = page.locator('.atlas-toggle-btn');
    await expect(layerToggles).toHaveCount(5);
    const archToggle = page.locator('.atlas-toggle-btn[data-layer="archaeology"]');
    await expect(archToggle).toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'true');

    // Click toggle to turn off and back on
    await archToggle.click();
    await expect(archToggle).not.toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'false');
    await archToggle.click();
    await expect(archToggle).toHaveClass(/active/);
    await expect(archToggle).toHaveAttribute('aria-pressed', 'true');

    // Region Presets
    const presets = page.locator('.atlas-preset-btn');
    await expect(presets).toHaveCount(5);
    const levantBtn = page.locator('.atlas-preset-btn[data-preset="levant"]');
    await levantBtn.click();
    await expect(levantBtn).toHaveClass(/active/);

    // Assert Legend includes Global World Civilizations
    const globalLegend = page.locator('.atlas-legend-item', { hasText: 'Global World Civilizations' });
    await expect(globalLegend).toBeVisible();
    await expect(globalLegend.locator('.map-key-dot.dot-global')).toBeVisible();

    // Zoom controls
    const zoomIn = page.locator('#map-zoom-in');
    const zoomOut = page.locator('#map-zoom-out');
    const reset = page.locator('#map-reset-view');
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
    await expect(reset).toBeVisible();
  });

  test('Biblical waterways and kingdom boundaries render with high-resolution coordinates, solid cartographic strokes, and on-water typography (v00.01.35)', async ({ page }) => {
    await page.goto('/map?era=united_monarchy');
    await page.waitForTimeout(600);

    // 1. Kingdom boundaries must be rendered in empirePane as solid cartographic strokes with NO dashed borders
    const empirePolygons = page.locator('.leaflet-empire-pane svg path');
    const empireCount = await empirePolygons.count();
    expect(empireCount).toBeGreaterThanOrEqual(6);

    for (let i = 0; i < empireCount; i++) {
      const dash = await empirePolygons.nth(i).getAttribute('stroke-dasharray');
      expect(dash).toBeNull(); // Solid cartographic hairlines! No crude dashed '6, 6' borders
    }

    // 2. Lake bodies (Dead Sea & Sea of Galilee) must also render as solid polygons with NO dashed array in lakePane
    const lakePaths = page.locator('.leaflet-lake-pane svg path');
    const lakePathCount = await lakePaths.count();
    expect(lakePathCount).toBeGreaterThanOrEqual(2); // At least 2 lake polygons (Dead Sea & Galilee)

    for (let i = 0; i < lakePathCount; i++) {
      const dash = await lakePaths.nth(i).getAttribute('stroke-dasharray');
      expect(dash).toBeNull(); // No crude dashed '3, 5' borders!
    }

    // 2b. Rivers must render into riverPane strictly above lakes and regions
    const riverPaths = page.locator('.leaflet-river-pane svg path');
    const riverPathCount = await riverPaths.count();
    expect(riverPathCount).toBeGreaterThanOrEqual(3);

    // 3. Classical on-water typography markers must be rendered into waterPane
    const waterLabels = page.locator('.leaflet-water-pane .leaflet-water-label');
    await expect(waterLabels.first()).toBeVisible();
    const waterLabelCount = await waterLabels.count();
    expect(waterLabelCount).toBeGreaterThanOrEqual(5);

    await expect(page.locator('.leaflet-water-label', { hasText: 'THE GREAT SEA' })).toBeVisible();
    await expect(page.locator('.leaflet-water-label', { hasText: 'THE RED SEA' })).toBeVisible();
    await expect(page.locator('.leaflet-water-label', { hasText: 'DEAD SEA' })).toBeVisible();
    await expect(page.locator('.leaflet-water-label', { hasText: 'SEA OF GALILEE' })).toBeVisible();
  });

  test('Direct deep link to an archaeological site (?site=pilate-stone) displays the discovery detail drawer', async ({ page }) => {
    await page.goto('/map?site=pilate-stone');

    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#drawer-title')).toHaveText('The Pilate Stone');
    await expect(page.locator('#drawer-meta')).toContainText('Caesarea Maritima');
    await expect(page.locator('#drawer-desc')).toContainText('PILATUS');
    await expect(page.locator('#drawer-significance')).toContainText('Pontius Pilate');

    // Links to study desk and scripture
    const deskLink = page.locator('#drawer-desk-link');
    await expect(deskLink).toBeVisible();
    await expect(deskLink).toHaveAttribute('href', '/interact?figure=jesus-christ');

    // Close button hides drawer
    await page.locator('#atlas-drawer-close').click();
    await expect(drawer).toBeHidden();
  });

  test('Study Desk (/interact) 3rd column includes Map button that opens ancient map focused on active figure', async ({ page }) => {
    await page.goto('/interact', { waitUntil: 'networkidle' });

    // Ensure 3 view toggle buttons exist
    const listBtn = page.locator('#btn-view-list');
    const graphBtn = page.locator('#btn-view-graph');
    const mapBtn = page.locator('#btn-view-map');

    await expect(listBtn).toBeVisible();
    await expect(graphBtn).toBeVisible();
    await expect(mapBtn).toBeVisible();

    // Default view is List
    await expect(listBtn).toHaveClass(/active/);
    await expect(mapBtn).not.toHaveClass(/active/);
    await expect(page.locator('#ancient-map-container')).toBeHidden();

    // Click Map button
    await mapBtn.click();
    await expect(mapBtn).toHaveClass(/active/);
    await expect(mapBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(listBtn).not.toHaveClass(/active/);

    // Ancient Map container becomes visible and renders Leaflet
    const mapContainer = page.locator('#ancient-map-container');
    await expect(mapContainer).toBeVisible();
    await expect(mapContainer).toHaveClass(/leaflet-container/);

    // URL state synchronizes ?view=map
    expect(page.url()).toContain('view=map');

    // Deep linking to /interact?view=map preserves map view on load
    await page.goto('/interact?figure=daniel&view=map');
    await expect(page.locator('#btn-view-map')).toHaveClass(/active/);
    await expect(page.locator('#ancient-map-container')).toBeVisible();
  });

  test('Zero-Collision & Northern Kingdom of Israel hover accessibility: Only 1 tooltip visible at any time, Northern Kingdom inspectable without overlap', async ({ page }) => {
    await page.goto('/map?era=divided_monarchy_prophets', { waitUntil: 'networkidle' });

    // Ensure Leaflet map canvas is initialized
    const mapContainer = page.locator('#atlas-canvas-container');
    await expect(mapContainer).toBeVisible();

    // Hover over Samaria capital marker (Northern Kingdom of Israel)
    const samariaMarker = page.locator('.capital-marker-label', { hasText: 'Samaria' });
    await expect(samariaMarker).toBeVisible({ timeout: 5000 });
    await samariaMarker.hover();
    await page.waitForTimeout(300);

    // Verify Samaria/Israel tooltip is visible with Northern Kingdom badge
    const activeTooltip = page.locator('.leaflet-tooltip');
    await expect(activeTooltip).toBeVisible();
    await expect(activeTooltip).toContainText('Samaria');
    await expect(activeTooltip).toContainText('NORTHERN KINGDOM');

    // Hover over Jerusalem (Kingdom of Judah)
    const jerusalemMarker = page.locator('.capital-marker-label', { hasText: 'Jerusalem' });
    await expect(jerusalemMarker).toBeVisible();
    await jerusalemMarker.hover();
    await page.waitForTimeout(300);

    // Verify Jerusalem tooltip opened AND Samaria tooltip closed (strictly <= 1 tooltip exists in DOM)
    const tooltipsAfterJerusalem = page.locator('.leaflet-tooltip');
    expect(await tooltipsAfterJerusalem.count()).toBeLessThanOrEqual(1);
    await expect(tooltipsAfterJerusalem).toContainText('Jerusalem');

    // Click Samaria capital pin: Detail drawer opens with full historical dossier
    await samariaMarker.click();
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#drawer-title')).toContainText('Kingdom of Israel (Samaria)');
    await expect(page.locator('#drawer-meta')).toContainText('Capital: Samaria');
  });

  test('Map UI/UX Maturation Regression: Hover informationals are strictly constrained inside the map viewport with wrapped text, era buttons do not overflow, and visible marker labels do not collide', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/map?era=divided_monarchy_prophets', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const mapContainer = page.locator('#atlas-canvas-container');
    await expect(mapContainer).toBeVisible();
    const containerBox = await mapContainer.boundingBox();
    expect(containerBox).not.toBeNull();

    // 1. Era Timeline Scrubber: Divided Monarchy button must exist, be active, and no era button text may overflow its box
    const activeEraBtn = page.locator('.chrono-era-btn.active');
    await expect(activeEraBtn).toHaveCount(1);
    await expect(activeEraBtn).toHaveAttribute('data-era', 'divided_monarchy_prophets');

    const eraOverflowCount = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLElement>('.chrono-era-btn'));
      return btns.filter(btn => {
        const nameEl = btn.querySelector<HTMLElement>('.era-name');
        const btnRect = btn.getBoundingClientRect();
        const nameRect = nameEl?.getBoundingClientRect();
        return (nameRect && nameRect.right > btnRect.right + 1) || btn.scrollWidth > btn.clientWidth + 2;
      }).length;
    });
    expect(eraOverflowCount).toBe(0);

    // 2. Hover Informationals: Check Damascus, Tyre & Sidon, Samaria, Tel Dan Stele, Mesha Stele, and Aram-Damascus polygon
    const hoverTargets = [
      page.locator('.capital-marker-label', { hasText: 'Damascus' }),
      page.locator('.capital-marker-label', { hasText: 'Tyre & Sidon' }),
      page.locator('.capital-marker-label', { hasText: 'Samaria' }),
      page.locator('.leaflet-gold-marker', { hasText: 'Tel Dan Stele' }),
      page.locator('.leaflet-gold-marker', { hasText: 'Mesha Stele' }),
      page.locator('.capital-marker-label', { hasText: 'Bozrah & Sela' })
    ];

    for (const target of hoverTargets) {
      await expect(target).toBeVisible();
      await target.hover({ force: true });
      await page.waitForTimeout(250);

      const tooltip = page.locator('.leaflet-tooltip').first();
      await expect(tooltip).toBeVisible();

      const metrics = await tooltip.evaluate((el) => {
        const mapEl = document.getElementById('atlas-canvas-container')!;
        const mapRect = mapEl.getBoundingClientRect();
        const tipRect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const nestedDuplicate = el.querySelectorAll('.map-leaflet-tooltip').length;
        return {
          mapTop: mapRect.top,
          mapLeft: mapRect.left,
          mapRight: mapRect.right,
          mapBottom: mapRect.bottom,
          tipTop: tipRect.top,
          tipLeft: tipRect.left,
          tipRight: tipRect.right,
          tipBottom: tipRect.bottom,
          whiteSpace: style.whiteSpace,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          nestedDuplicate
        };
      });

      // Tooltip text must wrap (never white-space: nowrap) and never overflow horizontally out of its card
      expect(metrics.whiteSpace).toBe('normal');
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 4);
      // No double-nested .map-leaflet-tooltip box inside the outer .leaflet-tooltip.map-leaflet-tooltip
      expect(metrics.nestedDuplicate).toBe(0);

      // Tooltip bounding box must be strictly inside the map container on all 4 sides
      expect(metrics.tipTop).toBeGreaterThanOrEqual(metrics.mapTop + 6);
      expect(metrics.tipLeft).toBeGreaterThanOrEqual(metrics.mapLeft + 6);
      expect(metrics.tipRight).toBeLessThanOrEqual(metrics.mapRight - 6);
      expect(metrics.tipBottom).toBeLessThanOrEqual(metrics.mapBottom - 6);
    }

    // 3. Visible permanent marker labels must not collide in screen space
    const labelCollisions = await page.evaluate(() => {
      const labels = Array.from(
        document.querySelectorAll<HTMLElement>('.gold-coin-label, .capital-marker-label, .city-marker-label')
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0.1;
      });

      const rects = labels.map((el) => ({
        text: el.textContent?.trim() || '',
        rect: el.getBoundingClientRect()
      }));

      const collisions: string[] = [];
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i].rect;
          const b = rects[j].rect;
          const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (overlapX > 2 && overlapY > 2) {
            collisions.push(`${rects[i].text} <-> ${rects[j].text}`);
          }
        }
      }
      return collisions;
    });
    expect(labelCollisions).toEqual([]);
  });

  test("Biblical Journeys & Interactive Waypoint Stops: Paul's travel is explicitly labeled on-map, never intercepted by Roman Empire polygon, and every stop shows where & when Paul was there", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 860 });
    await page.goto('/map?era=apostolic_church', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    // 1. On-Map Route Title Pill must explicitly identify Paul's Missionary Journey on the canvas
    const paulBanner = page.locator('.route-badge-paul-second-journey .route-badge-pill');
    await expect(paulBanner).toBeVisible();
    await expect(paulBanner).toContainText("PAUL'S MISSIONARY JOURNEY");
    await expect(paulBanner).toContainText('AD 49–52');

    // 2. Hovering Paul's route banner or hit corridor must show Paul's Journey tooltip, NEVER the Roman Empire tooltip
    await paulBanner.hover();
    await page.waitForTimeout(250);
    const routeTooltip = page.locator('.leaflet-tooltip').first();
    await expect(routeTooltip).toBeVisible();
    await expect(routeTooltip).toContainText("Paul's Second Missionary Journey");
    await expect(routeTooltip).toContainText('Apostle Paul');
    await expect(routeTooltip).not.toContainText('Roman Empire (Augustus to Trajan)');

    // 3. All 11 numbered stops of Paul's Second Missionary Journey must be rendered and interactive
    const paulStops = page.locator('.route-stop-core[data-route-id="paul-second-journey"]');
    await expect(paulStops).toHaveCount(11);

    // Inspect Stop 5 (Philippi) and Stop 8 (Athens) and Stop 9 (Corinth)
    const stopChecks = [
      { index: 0, place: 'Antioch', when: 'Spring AD 49', ref: 'ACTS {15:35}' },
      { index: 4, place: 'Philippi', when: 'Autumn AD 49', ref: 'ACTS {16:12}' },
      { index: 7, place: 'Athens', when: 'Spring AD 50', ref: 'ACTS {17:15}' },
      { index: 8, place: 'Corinth', when: 'Spring AD 50 – Autumn AD 51', ref: 'ACTS {18:1}' }
    ];

    for (const check of stopChecks) {
      const stopEl = page.locator(`.route-stop-core[data-route-id="paul-second-journey"][data-stop-index="${check.index}"]`);
      await expect(stopEl).toBeVisible();
      await stopEl.hover();
      await page.waitForTimeout(250);

      const tip = page.locator('.leaflet-tooltip').first();
      await expect(tip).toBeVisible();
      await expect(tip).toContainText(check.place);
      await expect(tip).toContainText(check.when);
      await expect(tip).toContainText(check.ref);
      // Confirm Roman Empire polygon never intercepts the stop hover
      await expect(tip).not.toContainText('Imperial superpower; Caesar Augustus');

      // Confirm tooltip is 100% clamped inside the map viewport
      const bounds = await tip.evaluate((el) => {
        const mapRect = document.getElementById('atlas-canvas-container')!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return {
          insideTop: r.top >= mapRect.top + 6,
          insideLeft: r.left >= mapRect.left + 6,
          insideRight: r.right <= mapRect.right - 6,
          insideBottom: r.bottom <= mapRect.bottom - 6
        };
      });
      expect(bounds).toEqual({
        insideTop: true,
        insideLeft: true,
        insideRight: true,
        insideBottom: true
      });
    }

    // 4. Clicking a waypoint stop (Corinth, Stop 9) opens the detail drawer with location, date, and Scripture link, fully inside the map card
    const corinthStop = page.locator('.route-stop-core[data-route-id="paul-second-journey"][data-stop-index="8"]');
    await corinthStop.click();
    const drawer = page.locator('#atlas-detail-drawer');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#drawer-title')).toContainText('Stop 9 of 11: Corinth');
    await expect(page.locator('#drawer-meta')).toContainText('Spring AD 50 – Autumn AD 51');
    await expect(page.locator('#drawer-desc')).toContainText('Aquila and Priscilla');
    await expect(page.locator('#drawer-scripture-link')).toHaveAttribute('href', /ACT\.18\.1/);

    const drawerAndPaneCheck = await page.evaluate(() => {
      const cardRect = document.querySelector('.atlas-canvas-card')!.getBoundingClientRect();
      const drawerRect = document.getElementById('atlas-detail-drawer')!.getBoundingClientRect();
      const titleRect = document.getElementById('drawer-title')!.getBoundingClientRect();
      const waterZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-water-pane')!).zIndex, 10);
      const empireZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-empire-pane')!).zIndex, 10);
      const lakeZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-lake-pane')!).zIndex, 10);
      const riverZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-river-pane')!).zIndex, 10);
      const routeZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-route-pane')!).zIndex, 10);
      const cityZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-city-pane')!).zIndex, 10);
      const siteZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-site-pane')!).zIndex, 10);
      const stopZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-routeStop-pane')!).zIndex, 10);
      const tooltipZ = parseInt(window.getComputedStyle(document.querySelector('.leaflet-tooltip-pane')!).zIndex, 10);
      return {
        drawerInsideTop: drawerRect.top >= cardRect.top + 8,
        titleVisible: titleRect.top >= drawerRect.top,
        zOrderValid: waterZ < empireZ && empireZ < lakeZ && lakeZ < riverZ && riverZ < routeZ && routeZ < cityZ && cityZ <= siteZ && siteZ < stopZ && stopZ < tooltipZ
      };
    });
    expect(drawerAndPaneCheck).toEqual({
      drawerInsideTop: true,
      titleVisible: true,
      zOrderValid: true
    });
  });

  test('Granular Timeline Controls: From Apostolic Age, user can inspect John the Baptist in relation to Jesus, Jesus throughout His life (4 phases), Thomas to Parthia & India, and step stop-by-stop', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/map', { waitUntil: 'networkidle' });

    // 1. Click Apostolic Age tab
    await page.click('.chrono-era-btn[data-era="apostolic_church"]');
    await page.waitForTimeout(600);

    const granularBar = page.locator('#chrono-granular-bar');
    await expect(granularBar).toBeVisible();

    // Verify all requested granular tracks are selectable directly from Apostolic Age
    const expectedGranularIds = [
      'filter-john-jesus-parallel',
      'filter-john-baptist-only',
      'filter-jesus-phase-1',
      'filter-jesus-phase-2',
      'filter-jesus-phase-3',
      'filter-jesus-phase-4',
      'filter-jesus-all-phases',
      'filter-peter-philip',
      'filter-paul-1',
      'filter-paul-2',
      'filter-paul-3',
      'filter-paul-rome',
      'filter-john-patmos',
      'filter-thomas-india',
      'filter-andrew-mark'
    ];
    for (const gid of expectedGranularIds) {
      await expect(page.locator(`.chrono-granular-pill[data-granular-id="${gid}"]`)).toBeVisible();
    }

    // 2. Select "John the Baptist + Jesus Parallel (AD 26–29)" to see John the Baptist in his areas and in relation to Jesus
    await page.click('.chrono-granular-pill[data-granular-id="filter-john-jesus-parallel"]');
    await page.waitForTimeout(900);

    const johnStops = page.locator('.route-stop-core[data-route-id="john-baptist-ministry"]');
    const jesusEarlyStops = page.locator('.route-stop-core[data-route-id="jesus-early-ministry"]');
    await expect(johnStops).toHaveCount(5);
    await expect(jesusEarlyStops).toHaveCount(6);

    // Stepper must show both synchronized tracks and allow stepping through John's stops (Bethabara, Aenon near Salim, Machaerus)
    const stepper = page.locator('#chrono-waypoint-stepper');
    await expect(stepper).toBeVisible();
    await expect(stepper).toContainText('John the Baptist');

    // Step to Stop 4 of John the Baptist (Aenon Near Salim — parallel with Jesus in Judea, John 3:22–24)
    await page.click('#chrono-waypoint-stepper .stepper-stop-chip[data-stop-index="3"]');
    await page.waitForTimeout(500);
    await expect(page.locator('#drawer-title')).toContainText('Aenon Near Salim');
    await expect(page.locator('#drawer-desc')).toContainText('DIRECT RELATION TO JESUS');
    await expect(page.locator('#drawer-desc')).toContainText('Judean countryside');

    // Switch stepper tab to Jesus Phase 2 and inspect Stop 5 (Judean Countryside concurrent with John at Aenon)
    await page.click('.stepper-route-tab[data-stepper-route-id="jesus-early-ministry"]');
    await page.waitForTimeout(400);
    await page.click('#chrono-waypoint-stepper .stepper-stop-chip[data-stop-index="4"]');
    await page.waitForTimeout(500);
    await expect(page.locator('#drawer-title')).toContainText('Judean Countryside');
    await expect(page.locator('#drawer-desc')).toContainText('SPATIAL RELATION TO JOHN THE BAPTIST');

    // 3. Select "Complete Earthly Life of Jesus (All 4 Phases)" and confirm all 27 stops across 4 phases render
    await page.click('.chrono-granular-pill[data-granular-id="filter-jesus-all-phases"]');
    await page.waitForTimeout(900);
    await expect(page.locator('.route-stop-core[data-route-id="jesus-nativity-youth"]')).toHaveCount(6);
    await expect(page.locator('.route-stop-core[data-route-id="jesus-early-ministry"]')).toHaveCount(6);
    await expect(page.locator('.route-stop-core[data-route-id="jesus-galilean-ministry"]')).toHaveCount(8);
    await expect(page.locator('.route-stop-core[data-route-id="jesus-passion-resurrection"]')).toHaveCount(7);

    // 4. Select "Thomas: Parthia & India [Scripture + Patristic]" and verify dates, locations, and explicit evidence-class distinction
    await page.click('.chrono-granular-pill[data-granular-id="filter-thomas-india"]');
    await page.waitForTimeout(900);

    const thomasStops = page.locator('.route-stop-core[data-route-id="thomas-parthia-india"]');
    await expect(thomasStops).toHaveCount(6);
    await expect(page.locator('#chrono-granular-status')).toContainText('Canonical Scripture + Early Patristic / External Historical Attestation');

    // Step to Stop 4 (Taxila — King Gondophares, c. AD 46–49) and Stop 5 (Muziris / Malabar Coast, c. AD 52–68)
    await page.click('#chrono-waypoint-stepper .stepper-stop-chip[data-stop-index="3"]');
    await page.waitForTimeout(500);
    await expect(page.locator('#drawer-title')).toContainText('Taxila');
    await expect(page.locator('#drawer-meta')).toContainText('c. AD 46 – 49');
    await expect(page.locator('#drawer-meta')).toContainText('Historical Attestation');
    await expect(page.locator('#drawer-desc')).toContainText('Gondophares');

    await page.click('#stepper-next-btn');
    await page.waitForTimeout(500);
    await expect(page.locator('#drawer-title')).toContainText('Muziris / Cranganore');
    await expect(page.locator('#drawer-meta')).toContainText('c. AD 52 – 68');
    await expect(page.locator('#drawer-desc')).toContainText('Malabar');
  });

  test('Visual proof: captures high-resolution screenshots of map experiences', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Dedicated Atlas (/map)
    await page.goto('/map');
    await page.locator('.atlas-canvas-card').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/live_atlas_map.png', fullPage: false });

    // 2. Divided Monarchy era with active constrained hover tooltip (/map?era=divided_monarchy_prophets)
    await page.goto('/map?era=divided_monarchy_prophets');
    await page.locator('.atlas-canvas-card').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('.capital-marker-label', { hasText: 'Damascus' }).hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/live_atlas_divided_monarchy_tooltip.png', fullPage: false });

    // 3. Apostolic Church era with Granular Timeline Bar, John the Baptist + Jesus Parallel, and Thomas to India
    await page.goto('/map?era=apostolic_church&filter=filter-john-jesus-parallel');
    await page.waitForTimeout(900);
    await page.click('#chrono-waypoint-stepper .stepper-stop-chip[data-stop-index="3"]');
    await page.evaluate(() => document.getElementById('chrono-granular-panel')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/live_atlas_john_jesus_parallel.png', fullPage: false });

    await page.click('.chrono-granular-pill[data-granular-id="filter-thomas-india"]');
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementById('chrono-granular-panel')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/live_atlas_thomas_india.png', fullPage: false });

    // 4. Study desk with Map tab active (/interact?view=map)
    await page.goto('/interact?view=map', { waitUntil: 'networkidle' });
    await expect(page.locator('#ancient-map-container')).toBeVisible({ timeout: 10000 });
    await page.locator('#ancient-map-container').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/live_study_desk_map_tab.png', fullPage: false });

    // 5. United Monarchy with high-resolution kingdom boundaries, solid hairlines, and authentic water rendering
    await page.goto('/map?era=united_monarchy');
    await page.locator('.atlas-canvas-card').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/live_atlas_united_monarchy_boundaries.png', fullPage: false });
  });

  test('Regression: Natural water bodies and boundaries have zero geometric collisions, outline boxes, or lake cuts', async ({ page }) => {
    await page.goto('/map?era=babylonian_exile');
    await page.waitForTimeout(1500);

    // 1. Verify Chromium SVG path focus outline reset
    const outlineReset = await page.evaluate(() => {
      const paths = document.querySelectorAll('path, svg path, .leaflet-interactive');
      for (const p of Array.from(paths)) {
        (p as HTMLElement).focus();
        const style = window.getComputedStyle(p);
        if (style.outline && style.outline !== 'none' && !style.outline.includes('0px') && !style.outline.includes('none')) {
          return { element: p.tagName, outline: style.outline };
        }
      }
      return { element: null, outline: 'none' };
    });
    expect(outlineReset.outline).toBe('none');

    // 2. Verify zoom >= 8 detailed class hides water labels to prevent double-stamping over raster tiles
    await page.evaluate(() => {
      const map = (window as any).ancientAtlasApp?.getCanvas()?.map;
      if (map) map.setView([32.815, 35.58], 11, { animate: false });
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/live_atlas_galilee_babylonian_exile.png', fullPage: false });

    const waterLabelOpacity = await page.evaluate(() => {
      const label = document.querySelector('.leaflet-water-label');
      if (!label) return '0';
      return window.getComputedStyle(label).opacity;
    });
    expect(waterLabelOpacity).toBe('0');

    // 3. Verify United Monarchy uses unified Israel rather than conflicting divided kingdom boundaries
    await page.goto('/map?era=united_monarchy');
    await page.waitForTimeout(1500);
    const unitedRegions = await page.evaluate(() => {
      const app = (window as any).ancientAtlasApp;
      const era = app?.getActiveEra ? app.getActiveEra() : null;
      return era?.additionalRegionIds || [];
    });
    expect(unitedRegions).toContain('united_israel');
    expect(unitedRegions).not.toContain('israel_kingdom');
  });

  test('Strict 4-Tier Map Layering Hierarchy: Points > Paths > Small Polygons > Large Polygons (v00.01.38)', async ({ page }) => {
    await page.goto('/map?era=roman_christ');
    await page.waitForTimeout(1000);

    // 1. Verify pane z-index hierarchy
    const zIndexes = await page.evaluate(() => {
      const getZ = (cls: string) => parseInt(window.getComputedStyle(document.querySelector(cls)!).zIndex, 10);
      return {
        water: getZ('.leaflet-water-pane'),
        empire: getZ('.leaflet-empire-pane'),
        lake: getZ('.leaflet-lake-pane'),
        river: getZ('.leaflet-river-pane'),
        route: getZ('.leaflet-route-pane'),
        city: getZ('.leaflet-city-pane'),
        site: getZ('.leaflet-site-pane'),
        routeStop: getZ('.leaflet-routeStop-pane'),
        tooltip: getZ('.leaflet-tooltip-pane')
      };
    });

    // Tier 1 Points (city, site, routeStop) > Tier 2 Paths (route, river)
    expect(zIndexes.routeStop).toBeGreaterThan(zIndexes.route);
    expect(zIndexes.city).toBeGreaterThan(zIndexes.route);
    expect(zIndexes.site).toBeGreaterThan(zIndexes.route);

    // Tier 2 Paths (river, route) > Tier 3 Small Polygons (lake)
    expect(zIndexes.route).toBeGreaterThan(zIndexes.river);
    expect(zIndexes.river).toBeGreaterThan(zIndexes.lake);

    // Tier 3 Small Polygons (lake) > Tier 4 Large Region Polygons (empire, water)
    expect(zIndexes.lake).toBeGreaterThan(zIndexes.empire);
    expect(zIndexes.empire).toBeGreaterThan(zIndexes.water);

    // 2. Toggle routes off to test open water polygon hover accessibility
    await page.click('.atlas-toggle-btn[data-layer="routes"]');
    await page.waitForTimeout(400);

    // Hover over Dead Sea (first in lakePane DOM because it's larger)
    const deadSeaPolygon = page.locator('.leaflet-lake-pane svg path').first();
    await deadSeaPolygon.hover({ force: true });
    await page.waitForTimeout(300);
    const activeTooltip = page.locator('.leaflet-tooltip-pane .leaflet-tooltip');
    await expect(activeTooltip).toBeVisible();
    await expect(activeTooltip).toContainText('Dead Sea');

    // Hover over Sea of Galilee (last in lakePane DOM because it's smaller, rendered on top)
    const galileePolygon = page.locator('.leaflet-lake-pane svg path').last();
    await galileePolygon.hover({ force: true });
    await page.waitForTimeout(300);
    await expect(activeTooltip).toBeVisible();
    await expect(activeTooltip).toContainText('Sea of Galilee');

    // 3. Toggle routes back on and verify hovering route corridor intercepts region (Paths > Regions)
    await page.click('.atlas-toggle-btn[data-layer="routes"]');
    await page.waitForTimeout(400);
    const routeCorridor = page.locator('.leaflet-route-pane svg path').first();
    await routeCorridor.hover({ force: true });
    await page.waitForTimeout(400);
    const routeTooltip = page.locator('.leaflet-tooltip-pane .leaflet-tooltip');
    await expect(routeTooltip).toBeVisible();
    await expect(routeTooltip).toContainText(/JOURNEY|Stop|JESUS/i);
  });

  test('Regression: Archaeological sites & custom markers have absolute positioning with zero document-flow accumulation and true geographic alignment (v00.01.41)', async ({ page }) => {
    await page.goto('/map?era=all');
    await page.waitForTimeout(1000);

    const audit = await page.evaluate(() => {
      const getStyles = (selector: string) => {
        const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
        return els.map(el => {
          const style = window.getComputedStyle(el);
          return {
            label: el.innerText.trim(),
            position: style.position,
            offsetTop: el.offsetTop,
            offsetLeft: el.offsetLeft,
            transform: el.style.transform
          };
        });
      };

      const goldMarkers = getStyles('.leaflet-gold-marker');
      const capitalMarkers = getStyles('.leaflet-capital-marker');
      const cityMarkers = getStyles('.leaflet-city-marker');

      return {
        goldMarkers,
        capitalMarkers,
        cityMarkers
      };
    });

    // 1. All markers MUST have position: absolute (Leaflet coordinate contract)
    expect(audit.goldMarkers.length).toBeGreaterThan(0);
    for (const marker of audit.goldMarkers) {
      expect(marker.position).toBe('absolute');
      // Uniform anchor offset, zero sibling flow accumulation
      expect(marker.offsetTop).toBe(-14);
      expect(marker.offsetLeft).toBe(-14);
    }

    for (const marker of audit.capitalMarkers) {
      expect(marker.position).toBe('absolute');
      expect(marker.offsetTop).toBe(-6);
      expect(marker.offsetLeft).toBe(-6);
    }

    for (const marker of audit.cityMarkers) {
      expect(marker.position).toBe('absolute');
      expect(marker.offsetTop).toBe(-5);
      expect(marker.offsetLeft).toBe(-5);
    }

    // 2. Geographic Ground-Truth Assertions: Markers MUST sit on their historical regions
    const findMarker = (labelSnippet: string) => {
      const found = audit.goldMarkers.find(m => m.label.toLowerCase().includes(labelSnippet.toLowerCase()));
      if (!found) throw new Error(`Marker matching "${labelSnippet}" not found`);
      const match = found.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
      if (!match) throw new Error(`Could not parse transform: ${found.transform}`);
      return { label: found.label, x: parseFloat(match[1]), y: parseFloat(match[2]) };
    };

    // Arch of Titus (Rome): Must be in Western Europe, x < 250, y < 120 (NOT shifted down to Africa y > 200)
    const archOfTitus = findMarker('Arch of Titus');
    expect(archOfTitus.x).toBeLessThan(250);
    expect(archOfTitus.y).toBeLessThan(120);

    // Pilate Stone (Caesarea): Must be in the Levant, x ~ 340-420, y < 250 (NOT shifted down to Sudan y > 290)
    const pilateStone = findMarker('Pilate Stone');
    expect(pilateStone.x).toBeGreaterThan(300);
    expect(pilateStone.x).toBeLessThan(450);
    expect(pilateStone.y).toBeLessThan(250);

    // Merneptah Stele (Thebes / Luxor): Must be in Upper Egypt, south of Levant but north of Sudan (y between 260 and 340)
    const merneptah = findMarker('Merneptah');
    expect(merneptah.y).toBeGreaterThan(pilateStone.y);
    expect(merneptah.y).toBeLessThan(350);

    // Cyrus Cylinder (Babylon): Must be in Mesopotamia, east of Levant (x > pilateStone.x, y < 250)
    const cyrus = findMarker('Cyrus Cylinder');
    expect(cyrus.x).toBeGreaterThan(pilateStone.x);
    expect(cyrus.y).toBeLessThan(250);
  });

  test('Regression: Granular journey panel moved below key and map padded ~8% on left and right (v00.01.42)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/map');
    await page.waitForTimeout(1000);

    const layout = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const mapCard = document.querySelector('.atlas-canvas-card');
      const legend = document.querySelector('.atlas-legend');
      const granular = document.querySelector('#chrono-granular-panel');

      const mapRect = mapCard?.getBoundingClientRect();
      const legendRect = legend?.getBoundingClientRect();
      const granularRect = granular?.getBoundingClientRect();

      return {
        docWidth,
        mapTop: mapRect?.top ?? 0,
        mapBottom: mapRect?.bottom ?? 0,
        mapLeft: mapRect?.left ?? 0,
        mapRight: mapRect?.right ?? 0,
        mapWidth: mapRect?.width ?? 0,
        legendTop: legendRect?.top ?? 0,
        legendBottom: legendRect?.bottom ?? 0,
        granularTop: granularRect?.top ?? 0,
        leftPaddingPct: mapRect ? (mapRect.left / docWidth) * 100 : 0,
        rightPaddingPct: mapRect ? ((docWidth - mapRect.right) / docWidth) * 100 : 0
      };
    });

    // 1. Vertical DOM Order: Map is above Legend, Legend is above Granular Panel
    expect(layout.mapBottom).toBeLessThanOrEqual(layout.legendTop);
    expect(layout.legendBottom).toBeLessThanOrEqual(layout.granularTop);

    // 2. Padding: Map is padded ~8% on left and right sides of viewport
    expect(layout.leftPaddingPct).toBeGreaterThanOrEqual(7.0);
    expect(layout.leftPaddingPct).toBeLessThanOrEqual(9.5);
    expect(layout.rightPaddingPct).toBeGreaterThanOrEqual(7.0);
    expect(layout.rightPaddingPct).toBeLessThanOrEqual(9.5);
  });
});


