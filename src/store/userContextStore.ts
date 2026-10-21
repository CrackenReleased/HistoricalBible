/**
 * src/store/userContextStore.ts
 * Shared cross-page user context store (Bible Reader <-> Map <-> Interact Study Desk)
 * Enables HistoricalBible.com to remain self-aware and responsive to the user's active reading/study context.
 */

import {
  BIBLICAL_ROUTES,
  CHRONOLOGICAL_ERAS,
  type BiblicalRoute
} from '../data/ancientMapData.ts';
import { getDatedEvent } from '../data/datedEvents.ts';

export const USER_CONTEXT_STORAGE_KEY = 'hb_user_context_v1';

export interface HistoricalBibleUserContext {
  source: 'bible' | 'interact' | 'map';
  updatedAt: string;
  label: string;
  sublabel?: string;
  eraId?: string;
  journeyId?: string;
  stopIndex?: number;
  siteId?: string;
  cityKey?: string;
  figureId?: string;
  bibleHref: string;
  interactHref: string;
  mapHref: string;
}

export function readUserContext(storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null): HistoricalBibleUserContext | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(USER_CONTEXT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HistoricalBibleUserContext>;
    if (!parsed || typeof parsed.label !== 'string' || !parsed.bibleHref || !parsed.interactHref || !parsed.mapHref) {
      return null;
    }
    return parsed as HistoricalBibleUserContext;
  } catch {
    return null;
  }
}

export function writeUserContext(
  context: HistoricalBibleUserContext,
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(USER_CONTEXT_STORAGE_KEY, JSON.stringify(context));
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves a Bible Reader passage (book, chapter, verse, chronology) into a cross-page context
 * including the best-matching historical era, biblical journey, and stop index.
 */
export function resolvePassageUserContext(params: {
  bookOsis: string;
  bookName: string;
  chapter: number;
  verseNum?: number;
  eraId?: string;
  eraName?: string;
  eventDateLabel?: string;
}): HistoricalBibleUserContext {
  const { bookOsis, bookName, chapter, verseNum = 1, eraId, eraName, eventDateLabel } = params;
  const normBook = bookName.toLowerCase().trim();
  const normOsis = bookOsis.toLowerCase().trim();

  // Match route & stop by inspecting stop.scriptureRef first (e.g. "Acts 13:2–3", "Acts 13:6–12", "Genesis 12:1–5")
  let matchedRoute: BiblicalRoute | undefined;
  let matchedStopIndex = 0;

  const chapterRegex = new RegExp(`\\b${bookName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${chapter}(?:[:\\s–-]|$)`, 'i');
  for (const route of BIBLICAL_ROUTES) {
    const idx = route.stops.findIndex(stop => chapterRegex.test(stop.scriptureRef));
    if (idx !== -1) {
      matchedRoute = route;
      matchedStopIndex = idx;
      break;
    }
  }

  // Fallback book/chapter range matching for major journeys
  if (!matchedRoute) {
    if (normOsis === 'act' || normBook === 'acts') {
      if (chapter >= 13 && chapter <= 14) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'paul-first-journey');
      else if (chapter >= 15 && chapter <= 18) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'paul-second-journey');
      else if (chapter >= 19 && chapter <= 21) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'paul-third-journey');
      else if (chapter >= 27 && chapter <= 28) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'paul-rome-voyage');
      else if (chapter >= 1 && chapter <= 12) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'peter-pentecost-lydda-caesarea');
    } else if (normOsis === 'gen' || normBook === 'genesis') {
      if (chapter >= 11 && chapter <= 25) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'abraham-covenant-journey');
      else if (chapter >= 27 && chapter <= 35) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'jacob-bethel-haran');
      else if (chapter >= 37 && chapter <= 50) matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'joseph-egypt-journey');
    } else if (normOsis === 'exod' || normBook === 'exodus') {
      matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'moses-exodus-route');
    } else if (normOsis === 'Josh'.toLowerCase() || normBook === 'joshua') {
      matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'joshua-canaan-campaign');
    } else if (['matt', 'mark', 'luke', 'john'].includes(normOsis)) {
      matchedRoute = BIBLICAL_ROUTES.find(r => r.id === 'jesus-galilee-judea-ministry');
    }
  }

  // Determine valid atlas eraId
  let resolvedEraId = eraId && CHRONOLOGICAL_ERAS.some(e => e.id === eraId) ? eraId : undefined;
  if (!resolvedEraId && matchedRoute) {
    const ownerEra = CHRONOLOGICAL_ERAS.find(e => e.id !== 'all' && e.activeRouteIds.includes(matchedRoute!.id));
    resolvedEraId = ownerEra?.id;
  }
  if (!resolvedEraId) {
    if (['act', 'rom', '1cor', '2cor', 'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim', 'titus', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john', '3john', 'jude', 'rev'].includes(normOsis)) {
      resolvedEraId = 'apostolic_church';
    } else if (['matt', 'mark', 'luke', 'john'].includes(normOsis)) {
      resolvedEraId = 'roman_christ';
    } else if (['gen'].includes(normOsis)) {
      resolvedEraId = 'patriarchs';
    } else if (['exod', 'lev', 'num', 'deut', 'josh', 'judg', 'ruth'].includes(normOsis)) {
      resolvedEraId = 'exodus';
    } else if (['1sam', '2sam'].includes(normOsis)) {
      resolvedEraId = 'united_monarchy';
    } else if (['1kgs', '2kgs', '1chr', '2chr', 'isa', 'hos', 'amos', 'mic', 'jonah'].includes(normOsis)) {
      resolvedEraId = 'divided_monarchy_prophets';
    } else if (['jer', 'lam', 'ezek', 'dan'].includes(normOsis)) {
      resolvedEraId = 'babylonian_exile';
    } else if (['ezra', 'neh', 'esth', 'hag', 'zech', 'mal'].includes(normOsis)) {
      resolvedEraId = 'persian_restoration';
    }
  }

  const resolvedEra = CHRONOLOGICAL_ERAS.find(e => e.id === resolvedEraId);
  const datedEvent = getDatedEvent(bookOsis, chapter, verseNum);
  const siteId = datedEvent?.siteId;
  const figureId = matchedRoute?.figureId || (siteId === 'taylor-prism' ? 'hezekiah' : undefined);

  const subParts = [
    datedEvent ? datedEvent.dateLabel : undefined,
    eraName || resolvedEra?.name,
    eventDateLabel || resolvedEra?.yearLabel,
    matchedRoute?.name
  ].filter(Boolean);

  const osisRef = `${bookOsis.toUpperCase()}.${chapter}.${verseNum}`;
  const mapParams = new URLSearchParams();
  if (resolvedEraId) mapParams.set('era', resolvedEraId);
  mapParams.set('ref', osisRef);
  if (matchedRoute) mapParams.set('journey', matchedRoute.id);
  if (siteId) mapParams.set('site', siteId);
  if (figureId) mapParams.set('figure', figureId);

  return {
    source: 'bible',
    updatedAt: new Date().toISOString(),
    label: verseNum && verseNum > 1 ? `${bookName} ${chapter}:${verseNum}` : `${bookName} ${chapter}`,
    sublabel: subParts.join(' · '),
    eraId: resolvedEraId,
    journeyId: matchedRoute?.id,
    stopIndex: matchedStopIndex,
    siteId,
    figureId,
    bibleHref: `/bible?ref=${encodeURIComponent(osisRef)}&book=${encodeURIComponent(bookName)}&chapter=${encodeURIComponent(String(chapter))}&verse=${encodeURIComponent(String(verseNum))}`,
    interactHref: `/interact?ref=${encodeURIComponent(osisRef)}`,
    mapHref: mapParams.toString() ? `/map?${mapParams.toString()}` : '/map'
  };
}
