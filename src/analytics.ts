/**
 * Historical Bible — Centralized GA4 Telemetry & Event Analytics
 * Measurement ID: G-P4HE0VJJC9
 * 
 * Provides defensive, privacy-preserving event tracking across:
 * - KJV Scripture Reader (chapters, verses, concordance)
 * - Interactive World History & Archaeological Study Desk
 * - Biblical World Map & Atlas Explorer
 * - Curiosity Doors, Navigation, and Document Downloads (Bible.pdf)
 */

export const GA_MEASUREMENT_ID = 'G-P4HE0VJJC9';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Dispatches an event to GA4 via gtag() with defensive fallback to dataLayer.
 * Never throws or blocks runtime execution if analytics is blocked or offline.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[HistoricalBible Analytics]', eventName, params, err);
    }
  }
}

/**
 * Tracks when a user views/reads a specific Bible chapter.
 */
export function trackBibleChapterView(book: string, chapter: number, verseCount?: number): void {
  trackEvent('bible_chapter_read', {
    event_category: 'scripture_reader',
    book_name: book,
    chapter_number: chapter,
    verse_count: verseCount ?? 0,
    bible_reference: `${book} ${chapter}`,
  });
}

/**
 * Tracks when a reader selects an individual verse for cross-referencing or word study.
 */
export function trackBibleVerseSelect(book: string, chapter: number, verse: number, reference: string): void {
  trackEvent('bible_verse_select', {
    event_category: 'scripture_reader',
    book_name: book,
    chapter_number: chapter,
    verse_number: verse,
    bible_reference: reference,
  });
}

/**
 * Tracks switching tabs in the Scripture Reader companion drawer (xrefs, word, chrono, map).
 */
export function trackCompanionTabSwitch(tabName: string): void {
  trackEvent('companion_tab_switch', {
    event_category: 'scripture_reader',
    tab_name: tabName,
  });
}

/**
 * Tracks toggling a map overlay chip (places, kingdoms, artifacts, journeys) in the companion map.
 */
export function trackCompanionLayerToggle(layerName: string, enabled: boolean): void {
  trackEvent('companion_map_layer_toggle', {
    event_category: 'scripture_reader',
    layer_name: layerName,
    layer_state: enabled ? 'enabled' : 'disabled',
  });
}

/**
 * Tracks word-level concordance search or inspection in the Scripture text.
 */
export function trackConcordanceInspect(word: string, occurrences?: number): void {
  trackEvent('concordance_inspect', {
    event_category: 'scripture_reader',
    inspected_word: word,
    occurrence_count: occurrences ?? 0,
  });
}

/**
 * Tracks downloading the canonical KJV Bible PDF.
 */
export function trackPdfDownload(source: string): void {
  trackEvent('bible_pdf_download', {
    event_category: 'downloads',
    file_name: 'Bible.pdf',
    download_source: source,
  });
}

/**
 * Tracks selecting or inspecting an archaeological site, artifact, or place in the Atlas.
 */
export function trackMapDossierView(title: string, category: string, scriptureRef?: string): void {
  trackEvent('map_dossier_view', {
    event_category: 'atlas_map',
    dossier_title: title,
    dossier_category: category,
    scripture_ref: scriptureRef || 'none',
  });
}

/**
 * Tracks toggling an empire or geography layer in the main Atlas map.
 */
export function trackMapLayerToggle(layerName: string, enabled: boolean): void {
  trackEvent('atlas_layer_toggle', {
    event_category: 'atlas_map',
    layer_name: layerName,
    layer_state: enabled ? 'enabled' : 'disabled',
  });
}

/**
 * Tracks jumping to an Atlas map preset (e.g. Jerusalem, Galilee, Egypt, Mesopotamia, Rome).
 */
export function trackMapPreset(preset: string): void {
  trackEvent('atlas_preset_jump', {
    event_category: 'atlas_map',
    preset_name: preset,
  });
}

/**
 * Tracks selecting a historical figure (e.g., Jesus Christ, Hezekiah, Cyrus, Paul).
 */
export function trackHistoricalFigureSelect(figureId: string, figureName?: string): void {
  trackEvent('historical_figure_select', {
    event_category: 'study_desk',
    figure_id: figureId,
    figure_name: figureName || figureId,
  });
}

/**
 * Tracks filtering by a world history era or empire in the Interact study desk.
 */
export function trackHistoricalEraSelect(eraId: string): void {
  trackEvent('historical_era_filter', {
    event_category: 'study_desk',
    era_id: eraId,
  });
}

/**
 * Tracks selecting an ancient empire in the study desk.
 */
export function trackHistoricalEmpireSelect(empireId: string): void {
  trackEvent('historical_empire_filter', {
    event_category: 'study_desk',
    empire_id: empireId,
  });
}

/**
 * Tracks search actions across names, journeys, concordance, or site collections.
 */
export function trackSearchQuery(query: string, searchType: 'site' | 'concordance' | 'names' | 'journey', resultCount?: number): void {
  if (!query || query.trim().length === 0) return;
  trackEvent('site_search', {
    event_category: 'search',
    search_type: searchType,
    search_term: query.trim(),
    result_count: resultCount ?? 0,
  });
}

/**
 * Tracks clicking on curiosity doors on the Front Door / Home page.
 */
export function trackCuriosityDoorClick(doorId: string): void {
  trackEvent('curiosity_door_click', {
    event_category: 'front_door',
    door_id: doorId,
  });
}

/**
 * Tracks submission of the Contact & Inquiries form.
 */
export function trackContactSubmit(optIn: boolean): void {
  trackEvent('contact_form_submit', {
    event_category: 'contact',
    email_list_opt_in: optIn ? 'yes' : 'no',
  });
}

/**
 * Initializes global click delegates for PDF downloads, external scholarly citations,
 * and curiosity doors across all pages.
 */
export function initGlobalAutoTracking(): void {
  if (typeof document === 'undefined') return;

  const bindGlobalListeners = () => {
    // 1. PDF download clicks
    document.querySelectorAll<HTMLAnchorElement>('a[href*="Bible.pdf"], a[download*="Bible.pdf"]').forEach((link) => {
      if (link.dataset.analyticsBound === 'true') return;
      link.dataset.analyticsBound = 'true';
      link.addEventListener('click', () => {
        const source = link.getAttribute('id') || link.getAttribute('class') || link.getAttribute('href') || 'unknown';
        trackPdfDownload(source);
      });
    });

    // 2. Curiosity doors & Front Door thread starters
    document.querySelectorAll<HTMLElement>('.entry-card[data-door], #btn-begin-thread, .thread-stop').forEach((el) => {
      if (el.dataset.analyticsBound === 'true') return;
      el.dataset.analyticsBound = 'true';
      el.addEventListener('click', () => {
        const door = el.getAttribute('data-door') || el.id || el.textContent?.trim().slice(0, 30) || 'unknown';
        trackCuriosityDoorClick(door);
      });
    });

    // 3. Outbound archaeological and museum links
    document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"][href^="http"]').forEach((link) => {
      if (link.dataset.analyticsBound === 'true') return;
      link.dataset.analyticsBound = 'true';
      link.addEventListener('click', () => {
        const href = link.href;
        if (!href.includes(window.location.hostname)) {
          trackEvent('outbound_evidence_click', {
            event_category: 'outbound_evidence',
            destination_url: href,
            anchor_text: link.textContent?.trim().slice(0, 50) || '',
          });
        }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindGlobalListeners);
  } else {
    bindGlobalListeners();
  }
}

// Auto-run global delegations on script import in browser environments
if (typeof window !== 'undefined') {
  initGlobalAutoTracking();
}
