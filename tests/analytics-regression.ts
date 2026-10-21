import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GA_MEASUREMENT_ID,
  trackEvent,
  trackBibleChapterView,
  trackBibleVerseSelect,
  trackCompanionTabSwitch,
  trackCompanionLayerToggle,
  trackPdfDownload,
  trackMapPreset,
  trackMapDossierView,
  trackHistoricalFigureSelect,
  trackCuriosityDoorClick,
  trackContactSubmit
} from '../src/analytics.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('GA4 tracking tag G-P4HE0VJJC9 is installed across all public site pages', () => {
  const pages = [
    'index.html',
    'bible.html',
    'map.html',
    'interact.html',
    'contact.html',
    'tapestry.html'
  ];

  for (const pageName of pages) {
    const fullPath = path.join(rootDir, pageName);
    assert.ok(fs.existsSync(fullPath), `Expected ${pageName} to exist`);
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Tag script loader check
    assert.match(
      content,
      new RegExp(`https://www.googletagmanager.com/gtag/js\\?id=${GA_MEASUREMENT_ID}`),
      `Missing Google Tag script tag in ${pageName}`
    );

    // 2. gtag config check
    assert.match(
      content,
      new RegExp(`gtag\\(['"]config['"],\\s*['"]${GA_MEASUREMENT_ID}['"]\\);`),
      `Missing gtag config call for ${GA_MEASUREMENT_ID} in ${pageName}`
    );

    // 3. window.dataLayer bootstrap check
    assert.match(
      content,
      /window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];/,
      `Missing window.dataLayer initialization in ${pageName}`
    );
  }
});

test('analytics module exports exact HistoricalBible GA4 measurement ID', () => {
  assert.equal(GA_MEASUREMENT_ID, 'G-P4HE0VJJC9');
});

test('trackEvent defensively dispatches to mock dataLayer with expected event payloads', () => {
  const mockDataLayer: any[] = [];
  (globalThis as any).window = {
    dataLayer: mockDataLayer,
  };

  // Test generic trackEvent fallback to dataLayer
  trackEvent('custom_unit_event', { key: 'value', count: 42 });
  assert.equal(mockDataLayer.length, 1);
  assert.deepEqual(mockDataLayer[0], {
    event: 'custom_unit_event',
    key: 'value',
    count: 42,
  });

  // Test Scripture Chapter read
  trackBibleChapterView('Genesis', 1, 31);
  assert.equal(mockDataLayer.length, 2);
  assert.deepEqual(mockDataLayer[1], {
    event: 'bible_chapter_read',
    event_category: 'scripture_reader',
    book_name: 'Genesis',
    chapter_number: 1,
    verse_count: 31,
    bible_reference: 'Genesis 1',
  });

  // Test Verse selection
  trackBibleVerseSelect('John', 1, 1, 'John 1:1');
  assert.equal(mockDataLayer.length, 3);
  assert.deepEqual(mockDataLayer[2], {
    event: 'bible_verse_select',
    event_category: 'scripture_reader',
    book_name: 'John',
    chapter_number: 1,
    verse_number: 1,
    bible_reference: 'John 1:1',
  });

  // Test Companion tab switch
  trackCompanionTabSwitch('map');
  assert.equal(mockDataLayer.length, 4);
  assert.deepEqual(mockDataLayer[3], {
    event: 'companion_tab_switch',
    event_category: 'scripture_reader',
    tab_name: 'map',
  });

  // Test Map layer toggle
  trackCompanionLayerToggle('cities', true);
  assert.equal(mockDataLayer.length, 5);
  assert.deepEqual(mockDataLayer[4], {
    event: 'companion_map_layer_toggle',
    event_category: 'scripture_reader',
    layer_name: 'cities',
    layer_state: 'enabled',
  });

  // Test PDF download
  trackPdfDownload('header_button');
  assert.equal(mockDataLayer.length, 6);
  assert.deepEqual(mockDataLayer[5], {
    event: 'bible_pdf_download',
    event_category: 'downloads',
    file_name: 'Bible.pdf',
    download_source: 'header_button',
  });

  // Test Map preset
  trackMapPreset('Jerusalem');
  assert.equal(mockDataLayer.length, 7);
  assert.deepEqual(mockDataLayer[6], {
    event: 'atlas_preset_jump',
    event_category: 'atlas_map',
    preset_name: 'Jerusalem',
  });

  // Test Map dossier view
  trackMapDossierView('Pilate Stone', 'archaeological_site', 'LUKE.3.1');
  assert.equal(mockDataLayer.length, 8);
  assert.deepEqual(mockDataLayer[7], {
    event: 'map_dossier_view',
    event_category: 'atlas_map',
    dossier_title: 'Pilate Stone',
    dossier_category: 'archaeological_site',
    scripture_ref: 'LUKE.3.1',
  });

  // Test Historical figure select
  trackHistoricalFigureSelect('jesus-christ', 'Jesus Christ');
  assert.equal(mockDataLayer.length, 9);
  assert.deepEqual(mockDataLayer[8], {
    event: 'historical_figure_select',
    event_category: 'study_desk',
    figure_id: 'jesus-christ',
    figure_name: 'Jesus Christ',
  });

  // Test Curiosity door click
  trackCuriosityDoorClick('hezekiah');
  assert.equal(mockDataLayer.length, 10);
  assert.deepEqual(mockDataLayer[9], {
    event: 'curiosity_door_click',
    event_category: 'front_door',
    door_id: 'hezekiah',
  });

  // Test Contact form submit
  trackContactSubmit(true);
  assert.equal(mockDataLayer.length, 11);
  assert.deepEqual(mockDataLayer[10], {
    event: 'contact_form_submit',
    event_category: 'contact',
    email_list_opt_in: 'yes',
  });

  // Clean up global mock
  delete (globalThis as any).window;
});
