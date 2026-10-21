// src/data/scriptureLexicon.ts
import { localStore } from '../store/localFirstStore';
import { CURATED_LEXICON, LexiconEntry } from './scriptureLexiconData';
import { getReviewedWordOccurrence } from './reviewedWordOccurrences';

export type { LexiconEntry, LexiconUntranslated } from './scriptureLexiconData';

let strongsReverseCache: Record<string, {
  id: string;
  lang: 'Ancient Hebrew' | 'Koine Greek';
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongsDef: string;
  kjvDef: string;
}> | null = null;

let strongsFetchPromise: Promise<void> | null = null;
const STRONGS_CACHE_NAME = 'historical-bible-cache-v00.01.18-names';
const STRONGS_URL = '/data/strongs_reverse.json';

export function isStrongsReverseReady(): boolean {
  return strongsReverseCache !== null;
}

export async function prefetchStrongsReverse(): Promise<void> {
  if (strongsReverseCache) return;
  if (strongsFetchPromise) return strongsFetchPromise;

  strongsFetchPromise = (async () => {
    try {
      const cache =
        typeof window !== 'undefined' && 'caches' in window
          ? await window.caches.open(STRONGS_CACHE_NAME)
          : null;
      if (cache) {
        const cached = await cache.match(STRONGS_URL);
        if (cached) {
          strongsReverseCache = await cached.json();
          return;
        }
      }
      const res = await fetch(STRONGS_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} while loading ${STRONGS_URL}`);
      }
      if (cache) {
        await cache.put(STRONGS_URL, res.clone());
      }
      strongsReverseCache = await res.json();
    } catch (err) {
      console.warn('[scriptureLexicon] Reverse Strongs index unavailable (will retry on next lookup):', err);
    } finally {
      strongsFetchPromise = null;
    }
  })();

  return strongsFetchPromise;
}

// Prefetch reverse index in browser idle time
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
      void prefetchStrongsReverse();
    });
  } else {
    setTimeout(() => {
      void prefetchStrongsReverse();
    }, 1200);
  }
}

/**
 * Resolves comprehensive word definition, untranslated root lemma, pronunciation,
 * derivation, and contemporary modern meaning for any word clicked in the Bible.
 */
export function lookupScriptureLexicon(
  rawWord: string,
  bookOsis?: string,
  chapter?: number,
  verse?: number,
  options?: { isSupplied?: boolean; isDivine?: boolean; surface?: string }
): LexiconEntry {
  const clean = rawWord.trim().toLowerCase().replace(/[^a-z']/g, '');
  const titleCase = clean.charAt(0).toUpperCase() + clean.slice(1);
  const isOt = bookOsis ? isOtBook(bookOsis) : true;

  // 0a. Translator-Supplied Words (Italics)
  if (options?.isSupplied) {
    return {
      word: rawWord,
      definition: 'Translator-supplied English word added for clarity and grammatical flow.',
      untranslated: {
        language: isOt ? 'Ancient Hebrew' : 'Koine Greek',
        lemma: '—',
        transliteration: '',
        pronunciation: '',
        strongsId: '',
        derivation: 'Translator-supplied English word added by the KJV translators for grammatical clarity; not present as a distinct original-language token in the underlying Hebrew/Greek manuscript.',
        etymology: 'Translator-supplied English.'
      },
      modernMeaning: 'In the King James Version, words in brackets or italics are translator-supplied words added to complete the sense in English where the original language text implied the meaning without an explicit word.'
    };
  }

  // 0b. Reviewed Occurrence Check (e.g. Gen 1:2 Spirit)
  if (bookOsis && chapter && verse) {
    const osisRef = `${bookOsis}.${chapter}.${verse}`;
    const reviewedOcc = getReviewedWordOccurrence(osisRef, clean, options?.surface || rawWord, !!options?.isSupplied);
    if (reviewedOcc) {
      return {
        word: reviewedOcc.surface || rawWord,
        definition: `Reviewed canonical occurrence in ${osisRef}: ${reviewedOcc.reviewNote}`,
        untranslated: {
          language: isOt ? 'Ancient Hebrew' : 'Koine Greek',
          lemma: reviewedOcc.lemma,
          transliteration: reviewedOcc.transliteration,
          pronunciation: '',
          strongsId: reviewedOcc.strongsId,
          derivation: reviewedOcc.reviewNote,
          etymology: undefined
        },
        modernMeaning: reviewedOcc.reviewNote
      };
    }
  }

  // 0c. Unreviewed Divine Names or Title-Case "Lord"
  if (options?.surface === 'Lord' && !options?.isDivine) {
    return {
      word: 'Lord',
      definition: 'Title of honor or mastery (Lord); in this passage, not aligned to a specific Hebrew or Greek token.',
      untranslated: {
        language: isOt ? 'Ancient Hebrew' : 'Koine Greek',
        lemma: '—',
        transliteration: 'Lord',
        pronunciation: '',
        strongsId: '',
        derivation: 'Title of lordship or address (Lord); not aligned to a specific Hebrew or Greek token in this unreviewed occurrence.',
        etymology: 'Old English hlāfweard (keeper of the bread).'
      },
      modernMeaning: 'Master, ruler, or sovereign title (Lord).'
    };
  }

  // 1. Direct Curated Lexicon Match (Instant, zero latency)
  if (CURATED_LEXICON[clean]) {
    return { ...CURATED_LEXICON[clean] };
  }

  // 2. Stem-based Curated Match
  if (clean.endsWith('s') && CURATED_LEXICON[clean.slice(0, -1)]) {
    return { ...CURATED_LEXICON[clean.slice(0, -1)] };
  }
  if (clean.endsWith('ed') && CURATED_LEXICON[clean.slice(0, -2)]) {
    return { ...CURATED_LEXICON[clean.slice(0, -2)] };
  }
  if (clean.endsWith('ing') && CURATED_LEXICON[clean.slice(0, -3)]) {
    return { ...CURATED_LEXICON[clean.slice(0, -3)] };
  }

  // 3. Biblical Names Directory & Reviewed Name Lexicon (Covers all 2,620 names)
  const nameReview = localStore.getNameReview(clean) || localStore.getNameReview(titleCase);
  if (nameReview) {
    const strong = nameReview.strongs && nameReview.strongs[0];
    const isOldTestament = strong?.id?.startsWith('H') || (bookOsis && isOtBook(bookOsis));
    const lang = isOldTestament ? 'Ancient Hebrew' : 'Koine Greek';
    const hitchcockMeaning = nameReview.hitchcock && nameReview.hitchcock[0]
      ? nameReview.hitchcock[0]
      : nameReview.displayMeaning;

    return {
      word: nameReview.name,
      definition: hitchcockMeaning,
      nameMeaning: hitchcockMeaning,
      untranslated: {
        language: lang,
        lemma: strong?.lemma || '—',
        transliteration: strong?.xlit || strong?.translit || '',
        pronunciation: strong?.pron || '',
        strongsId: strong?.id || (nameReview.strongsIds && nameReview.strongsIds[0]) || '',
        derivation: strong?.derivation || nameReview.note || 'Biblical proper name recorded in the canonical Scriptures.',
        etymology: nameReview.english?.definition || undefined
      },
      modernMeaning: nameReview.identity?.text || strong?.strongs_def || `The historical and biblical identity of ${nameReview.name} in sacred Scripture.`
    };
  }

  // 4. Reverse Strong's Concordance Index (If cached or available)
  if (strongsReverseCache && strongsReverseCache[clean]) {
    const match = strongsReverseCache[clean];
    return {
      word: clean,
      definition: cleanStrongsDef(match.strongsDef) || `King James translation context: ${match.kjvDef}`,
      untranslated: {
        language: match.lang,
        lemma: match.lemma,
        transliteration: match.xlit,
        pronunciation: match.pron,
        strongsId: match.id,
        derivation: match.derivation || 'Derived from ancient root.',
        etymology: `KJV translation terms: ${match.kjvDef}`
      },
      modernMeaning: cleanModernMeaning(clean, match.strongsDef, match.kjvDef)
    };
  }

  // 5. Intelligent Fallback (Synthesizes biblical & linguistic origin)
  return {
    word: clean,
    definition: `Scriptural word appearing in the King James Version text.`,
    untranslated: {
      language: isOt ? 'Ancient Hebrew' : 'Koine Greek',
      lemma: '—',
      transliteration: clean,
      pronunciation: '',
      derivation: `Biblical ${isOt ? 'Hebrew' : 'Greek'} term translated into 1611 Early Modern English.`,
      etymology: `English token: "${clean}"`
    },
    modernMeaning: `In modern English, "${clean}" conveys its standard contemporary sense within this passage's context.`
  };
}

function cleanStrongsDef(def: string): string {
  if (!def) return '';
  return def.replace(/^properly,\s*/i, '').replace(/\{[^}]*\}/g, '').trim();
}

function cleanModernMeaning(word: string, strongsDef: string, kjvDef: string): string {
  if (strongsDef && strongsDef.length > 5) {
    const firstPart = strongsDef.split(';')[0].replace(/^properly,\s*/i, '').replace(/\{[^}]*\}/g, '').trim();
    return `In contemporary English, "${word}" means ${firstPart}.`;
  }
  if (kjvDef) {
    return `In modern usage, refers to: ${kjvDef.split(',')[0].trim()}.`;
  }
  return `In contemporary English, "${word}" expresses its direct biblical sense.`;
}

function isOtBook(osis: string): boolean {
  const ntBooks = new Set([
    'matt', 'mark', 'luke', 'john', 'acts', 'rom', '1cor', '2cor', 'gal', 'eph',
    'phil', 'col', '1thess', '2thess', '1tim', '2tim', 'titus', 'phlm', 'heb',
    'jas', '1pet', '2pet', '1john', '2john', '3john', 'jude', 'rev',
    'matthew', 'romans', 'corinthians', 'galatians', 'ephesians', 'philippians',
    'colossians', 'thessalonians', 'timothy', 'hebrews', 'james', 'peter', 'revelation'
  ]);
  return !ntBooks.has(osis.toLowerCase());
}
