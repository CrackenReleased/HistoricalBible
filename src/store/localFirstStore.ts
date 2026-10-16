/**
 * src/store/localFirstStore.ts
 * Local-First Client-Side Storage & Historical Synchrony Engine for HistoricalBible.com
 */

export interface KjvVerseData {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface CrossRefLink {
  s?: string;
  t?: string;
  from?: string;
  to?: string;
  v?: number;
  votes?: number;
}

export interface HitchcockName {
  name: string;
  meanings: string[];
}

export interface RankedBiblicalName {
  name: string;
  meanings: string[];
  occurrences: number;
  isFlagship: boolean;
  flagshipId?: string;
}

export type EvidenceCategoryKey =
  | 'scripture'
  | 'external_attestation'
  | 'chronological_reconstruction'
  | 'disputed'
  | 'theological_covenant';

export interface SecularContemporary {
  name: string;
  role: string;
  empireId: string;
  synchronyDetail: string;
  evidenceCategory: EvidenceCategoryKey;
  sourceCitation: string;
}

export interface PersonalNetworkLink {
  targetId: string;
  name: string;
  relation: string;
  ref: string;
}

export interface ScriptureAnchor {
  osisRef: string;
  displayRef: string;
  historicalContextNote: string;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  hitchcockKey: string;
  title: string;
  eraId: string;
  editorialProminence: number;
  measuredMentions: number;
  dateRangeLabel: string;
  startYear: number;
  endYear: number;
  hitchcockMeaning: string;
  covenantSummary: string;
  secularContemporaries: SecularContemporary[];
  personalNetwork: PersonalNetworkLink[];
  scriptureAnchors: ScriptureAnchor[];
}

export interface HistoricalEra {
  id: string;
  name: string;
  dateRangeLabel: string;
  startYear: number;
  endYear: number;
  worldContext: string;
  summary: string;
}

export interface WorldEmpire {
  id: string;
  name: string;
  dateRangeLabel: string;
  startYear: number;
  endYear: number;
  color: string;
  keyRulers: string[];
  biblicalIntersection: string;
}

export interface HistoricalSynchronyDataset {
  version: string;
  missionStatement: string;
  covenantPosture: string;
  evidenceCategories: Record<EvidenceCategoryKey, { label: string; description: string }>;
  eras: HistoricalEra[];
  empires: WorldEmpire[];
  figures: HistoricalFigure[];
}

const BOOK_TO_OSIS: Record<string, string> = {
  'Genesis': 'Gen', 'Exodus': 'Exod', 'Leviticus': 'Lev', 'Numbers': 'Num', 'Deuteronomy': 'Deut',
  'Joshua': 'Josh', 'Judges': 'Judg', 'Ruth': 'Ruth', '1 Samuel': '1Sam', '2 Samuel': '2Sam',
  '1 Kings': '1Kgs', '2 Kings': '2Kgs', '1 Chronicles': '1Chr', '2 Chronicles': '2Chr',
  'Ezra': 'Ezra', 'Nehemiah': 'Neh', 'Esther': 'Esth', 'Job': 'Job', 'Psalms': 'Ps', 'Psalm': 'Ps',
  'Proverbs': 'Prov', 'Ecclesiastes': 'Eccl', 'Song of Solomon': 'Song', 'Isaiah': 'Isa',
  'Jeremiah': 'Jer', 'Lamentations': 'Lam', 'Ezekiel': 'Ezek', 'Daniel': 'Dan',
  'Hosea': 'Hos', 'Joel': 'Joel', 'Amos': 'Amos', 'Obadiah': 'Obad', 'Jonah': 'Jonah',
  'Micah': 'Mic', 'Nahum': 'Nah', 'Habakkuk': 'Hab', 'Zephaniah': 'Zeph', 'Haggai': 'Hag',
  'Zechariah': 'Zech', 'Malachi': 'Mal', 'Matthew': 'Matt', 'Mark': 'Mark', 'Luke': 'Luke',
  'John': 'John', 'Acts': 'Acts', 'Romans': 'Rom', '1 Corinthians': '1Cor', '2 Corinthians': '2Cor',
  'Galatians': 'Gal', 'Ephesians': 'Eph', 'Philippians': 'Phil', 'Colossians': 'Col',
  '1 Thessalonians': '1Thess', '2 Thessalonians': '2Thess', '1 Timothy': '1Tim', '2 Timothy': '2Tim',
  'Titus': 'Titus', 'Philemon': 'Phlm', 'Hebrews': 'Heb', 'James': 'Jas', '1 Peter': '1Pet',
  '2 Peter': '2Pet', '1 John': '1John', '2 John': '2John', '3 John': '3John', 'Jude': 'Jude',
  'Revelation': 'Rev'
};

const OSIS_TO_BOOK: Record<string, string> = {};
for (const [book, osis] of Object.entries(BOOK_TO_OSIS)) {
  if (book !== 'Psalm') {
    OSIS_TO_BOOK[osis.toLowerCase()] = book;
  }
}

export class LocalFirstStore {
  private cacheName = 'historical-bible-cache-v2';
  private verses: KjvVerseData[] = [];
  private verseByOsis = new Map<string, KjvVerseData>();
  private chapterMap = new Map<string, KjvVerseData[]>();
  private crossRefAdj = new Map<string, Array<{ targetOsis: string; votes: number }>>();
  private hitchcock: Record<string, HitchcockName> = {};
  private rankedNames: RankedBiblicalName[] = [];
  private synchrony: HistoricalSynchronyDataset | null = null;
  private isLoaded = false;
  private initError: string | null = null;

  public async init(onProgress?: (msg: string, percent: number) => void): Promise<void> {
    if (this.isLoaded) return;
    this.initError = null;

    try {
      if (onProgress) onProgress('Initializing local Scripture & History store...', 10);
      const cache = typeof window !== 'undefined' && 'caches' in window
        ? await window.caches.open(this.cacheName)
        : null;

      if (onProgress) onProgress('Loading canonical KJV corpus...', 25);
      this.verses = await this.fetchWithCache<KjvVerseData[]>(cache, '/data/kjv_verses.json');

      if (onProgress) onProgress('Loading Historical Synchrony & Empires model...', 50);
      this.synchrony = await this.fetchWithCache<HistoricalSynchronyDataset>(
        cache,
        '/data/history/historical_synchrony.v1.json'
      );

      if (onProgress) onProgress('Indexing curated Scripture cross-references...', 70);
      const crossRefPayload = await this.fetchWithCache<any>(
        cache,
        '/data/cross_references_curated.json'
      );
      const rawCrossRefs: CrossRefLink[] = Array.isArray(crossRefPayload)
        ? crossRefPayload
        : (crossRefPayload?.links || []);

      if (onProgress) onProgress('Loading & ranking Biblical Names directory...', 85);
      this.hitchcock = await this.fetchWithCache<Record<string, HitchcockName>>(
        cache,
        '/data/hitchcock_names.json'
      );

      let falsePositiveNodes = new Set<string>();
      try {
        const auditJson = await this.fetchWithCache<{ findings?: Array<{ kind: string; node: string }> }>(
          cache,
          '/data/name_identities_audit.json'
        );
        if (auditJson && Array.isArray(auditJson.findings)) {
          for (const f of auditJson.findings) {
            if (f.kind === 'common_word_false_positive' && f.node) {
              falsePositiveNodes.add(f.node);
            }
          }
        }
      } catch {
        // Optional audit filter
      }

      this.buildIndices(rawCrossRefs, falsePositiveNodes);
      this.isLoaded = true;
      if (onProgress) onProgress('Ready', 100);
    } catch (err) {
      this.isLoaded = false;
      this.initError = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  private async fetchWithCache<T>(cache: Cache | null, url: string): Promise<T> {
    if (cache) {
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        return (await cachedResponse.json()) as T;
      }
    }
    const networkResponse = await fetch(url);
    if (!networkResponse.ok) {
      throw new Error(`HTTP ${networkResponse.status} while loading ${url}`);
    }
    if (cache) {
      await cache.put(url, networkResponse.clone());
    }
    return (await networkResponse.json()) as T;
  }

  private buildIndices(rawCrossRefs: CrossRefLink[], falsePositiveNodes: Set<string>): void {
    this.verseByOsis.clear();
    this.chapterMap.clear();
    this.crossRefAdj.clear();

    for (const v of this.verses) {
      const osisBook = BOOK_TO_OSIS[v.book] || v.book;
      const osisKey = `${osisBook}.${v.chapter}.${v.verse}`;
      this.verseByOsis.set(osisKey.toLowerCase(), v);

      const chapKey = `${osisBook}.${v.chapter}`.toLowerCase();
      const chapList = this.chapterMap.get(chapKey) || [];
      chapList.push(v);
      this.chapterMap.set(chapKey, chapList);
    }

    for (const link of rawCrossRefs) {
      const src = (link.s || link.from || '').trim();
      const tgt = (link.t || link.to || '').trim();
      const votes = Number(link.v ?? link.votes ?? 1);
      if (!src || !tgt) continue;

      const sKey = src.toLowerCase();
      const tKey = tgt.toLowerCase();

      if (!this.crossRefAdj.has(sKey)) this.crossRefAdj.set(sKey, []);
      this.crossRefAdj.get(sKey)!.push({ targetOsis: tgt, votes });

      if (!this.crossRefAdj.has(tKey)) this.crossRefAdj.set(tKey, []);
      this.crossRefAdj.get(tKey)!.push({ targetOsis: src, votes });
    }

    for (const [, list] of this.crossRefAdj) {
      list.sort((a, b) => b.votes - a.votes);
    }

    // Build prominence-sorted Hitchcock names list
    const flagshipByHitchcock = new Map<string, HistoricalFigure>();
    if (this.synchrony) {
      for (const fig of this.synchrony.figures) {
        flagshipByHitchcock.set(fig.hitchcockKey.toLowerCase(), fig);
        flagshipByHitchcock.set(fig.name.toLowerCase(), fig);
      }
    }

    // Pre-seeded canonical frequency weights for top biblical figures + live lookup
    const canonicalWeights: Record<string, number> = {
      'Jesus': 983, 'David': 1085, 'Moses': 847, 'Abraham': 250, 'Saul': 406,
      'Solomon': 305, 'Jacob': 377, 'Isaac': 132, 'Joseph': 250, 'Joshua': 218,
      'Samuel': 145, 'Paul': 185, 'Peter': 162, 'Aaron': 350, 'Hezekiah': 128,
      'Jeremiah': 147, 'Daniel': 85, 'Isaiah': 52, 'Elijah': 69, 'Elisha': 58,
      'John': 135, 'Noah': 58, 'Gideon': 39, 'Josiah': 53, 'Nehemiah': 82, 'Ezra': 78
    };

    this.rankedNames = Object.values(this.hitchcock)
      .filter(entry => !falsePositiveNodes.has(entry.name))
      .map(entry => {
        const flagship = flagshipByHitchcock.get(entry.name.toLowerCase());
        const occurrences = flagship
          ? flagship.measuredMentions
          : (canonicalWeights[entry.name] || 0);
        return {
          name: entry.name,
          meanings: entry.meanings || [],
          occurrences,
          isFlagship: Boolean(flagship),
          flagshipId: flagship?.id
        };
      })
      .sort((a, b) => {
        if (a.isFlagship !== b.isFlagship) return a.isFlagship ? -1 : 1;
        if (b.occurrences !== a.occurrences) return b.occurrences - a.occurrences;
        return a.name.localeCompare(b.name);
      });
  }

  public getInitError(): string | null {
    return this.initError;
  }

  public getVerseCount(): number {
    return this.verses.length;
  }

  public getSynchrony(): HistoricalSynchronyDataset {
    if (!this.synchrony) {
      throw new Error('HistoricalSynchronyDataset accessed before store initialization.');
    }
    return this.synchrony;
  }

  public normalizeToOsis(inputRef: string): string | null {
    const trimmed = inputRef.trim();
    if (!trimmed) return null;

    // Already OSIS format like "Gen.1.1" or "1Sam.16.13"
    if (/^[1-3]?[A-Za-z]+\.\d+\.\d+$/.test(trimmed)) {
      return trimmed;
    }

    // Human format like "Genesis 1:1", "1 Samuel 16:13", or "GENESIS {1:1}"
    const match = trimmed.match(/^([1-3]?\s*[A-Za-z\s]+?)\s*\{?(\d+):(\d+)\}?$/);
    if (!match) return null;

    const rawBook = match[1].trim().replace(/\s+/g, ' ');
    const chapter = Number(match[2]);
    const verse = Number(match[3]);

    for (const [bookName, osis] of Object.entries(BOOK_TO_OSIS)) {
      if (bookName.toLowerCase() === rawBook.toLowerCase() || osis.toLowerCase() === rawBook.toLowerCase()) {
        return `${osis}.${chapter}.${verse}`;
      }
    }
    return null;
  }

  public getVerseByOsis(osisRef: string): KjvVerseData | null {
    const normalized = this.normalizeToOsis(osisRef) || osisRef.trim();
    return this.verseByOsis.get(normalized.toLowerCase()) || null;
  }

  public getChapterVerses(bookOrOsis: string, chapter: number): KjvVerseData[] {
    const osis = BOOK_TO_OSIS[bookOrOsis] || bookOrOsis;
    return this.chapterMap.get(`${osis}.${chapter}`.toLowerCase()) || [];
  }

  public formatDisplayRef(v: KjvVerseData): string {
    return `${v.book.toUpperCase()} {${v.chapter}:${v.verse}}`;
  }

  public toOsisRef(v: KjvVerseData): string {
    const osisBook = BOOK_TO_OSIS[v.book] || v.book;
    return `${osisBook}.${v.chapter}.${v.verse}`;
  }

  /**
   * Formats raw KJV text into safe HTML preserving:
   * 1. [...] translator italics as <em class="kjv-italics">[word]</em>
   * 2. LORD / GOD divine covenant casing as <span class="kjv-divine-name">L<span class="kjv-divine-rest">ORD</span></span>
   */
  public formatCanonicalKjvHtml(rawText: string): string {
    const escaped = rawText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\[([^\]]+)\]/g, '<em class="kjv-italics">[$1]</em>')
      .replace(
        /\b(LORD|GOD|JEHOVAH)\b/g,
        (_match, word: string) =>
          `<span class="kjv-divine-name">${word.charAt(0)}<span class="kjv-divine-rest">${word.slice(1)}</span></span>`
      );
  }

  public getCrossRefsForVerse(osisRef: string, limit = 12): Array<{
    targetOsis: string;
    votes: number;
    verse: KjvVerseData;
  }> {
    const normalized = (this.normalizeToOsis(osisRef) || osisRef).toLowerCase();
    const links = this.crossRefAdj.get(normalized) || [];
    const results: Array<{ targetOsis: string; votes: number; verse: KjvVerseData }> = [];
    const seen = new Set<string>();

    for (const item of links) {
      const tLower = item.targetOsis.toLowerCase();
      if (seen.has(tLower)) continue;
      seen.add(tLower);
      const targetVerse = this.verseByOsis.get(tLower);
      if (targetVerse) {
        results.push({ targetOsis: item.targetOsis, votes: item.votes, verse: targetVerse });
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  public getRankedNames(filterQuery = '', limit = 60): RankedBiblicalName[] {
    const q = filterQuery.trim().toLowerCase();
    if (!q) {
      return this.rankedNames.slice(0, limit);
    }
    return this.rankedNames
      .filter(
        n =>
          n.name.toLowerCase().includes(q) ||
          n.meanings.some(m => m.toLowerCase().includes(q))
      )
      .slice(0, limit);
  }

  public searchAll(query: string, maxVerses = 25): {
    figures: HistoricalFigure[];
    empires: WorldEmpire[];
    verses: KjvVerseData[];
    names: RankedBiblicalName[];
  } {
    const trimmed = query.trim();
    if (!trimmed || !this.synchrony) {
      return { figures: [], empires: [], verses: [], names: [] };
    }
    const lower = trimmed.toLowerCase();

    const figures = this.synchrony.figures.filter(
      f =>
        f.name.toLowerCase().includes(lower) ||
        f.title.toLowerCase().includes(lower) ||
        f.covenantSummary.toLowerCase().includes(lower) ||
        f.secularContemporaries.some(
          s => s.name.toLowerCase().includes(lower) || s.synchronyDetail.toLowerCase().includes(lower)
        )
    );

    const empires = this.synchrony.empires.filter(
      e =>
        e.id.toLowerCase().includes(lower) ||
        e.name.toLowerCase().includes(lower) ||
        e.keyRulers.some(r => r.toLowerCase().includes(lower)) ||
        e.biblicalIntersection.toLowerCase().includes(lower)
    );

    // Check if query is a direct Scripture reference first
    const directVerse = this.getVerseByOsis(trimmed);
    const verses: KjvVerseData[] = [];
    if (directVerse) {
      verses.push(directVerse);
    }

    for (const v of this.verses) {
      if (verses.length >= maxVerses) break;
      const disp = `${v.book} ${v.chapter}:${v.verse}`.toLowerCase();
      if (disp.includes(lower) || v.text.toLowerCase().includes(lower)) {
        if (!directVerse || directVerse !== v) {
          verses.push(v);
        }
      }
    }

    const names = this.getRankedNames(trimmed, 12);
    return { figures, empires, verses, names };
  }
}

export const localStore = new LocalFirstStore();
