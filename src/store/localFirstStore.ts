/**
 * Local-First Client-Side Storage Engine for HistoricalBible.com
 * Leverages the browser's CacheStorage & IndexedDB to download the datasets once,
 * store them on the user's device, and execute all subsequent scripture searches,
 * cross-reference queries, and theological lookups locally with 0ms server latency.
 */

export interface KjvVerseData {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface CrossRefLink {
  s?: string;     // source (e.g. "Gen.1.1")
  t?: string;     // target (e.g. "Ps.115.15")
  from?: string;  // backward compatibility
  to?: string;
  v?: number;     // votes
  votes?: number;
}

export interface HitchcockName {
  name: string;
  meanings: string[];
}

export interface TheologicalRelation {
  source: string;
  target: string;
  votes: number;
  status: string;
  classification: 'supported' | 'ambiguous' | 'unsupported';
  relation: string;
  reason: string;
  evidence: Array<{ ref: string; quote: string; pdf_page: number }>;
  limitations: string[] | string;
  reviewer: string;
}

export class LocalFirstStore {
  private cacheName = 'historicalbible-v1';
  public isReady = false;
  public kjvVerses: Record<string, string> = {};
  public crossRefs: CrossRefLink[] = [];
  public hitchcockNames: Record<string, HitchcockName> = {};
  public theologicalRelations: Record<string, TheologicalRelation> = {};
  public onProgress?: (msg: string, percent: number) => void;

  /**
   * Initializes local-first storage, fetching data into client cache on first run
   */
  public async init(useFullBundle: boolean = false): Promise<void> {
    try {
      this.reportProgress('Connecting to local storage...', 5);
      
      const xrefUrl = useFullBundle 
        ? '/data/cross_references_bundle.json' 
        : '/data/cross_references_curated.json';

      // 1. Fetch & cache KJV scripture text
      this.reportProgress('Loading KJV Scripture Corpus (31,102 verses)...', 15);
      const kjvData = await this.fetchWithCache<{ verses?: Record<string, string> } | Record<string, string>>('/data/kjv_verses.json');
      this.kjvVerses = (kjvData as { verses?: Record<string, string> }).verses || (kjvData as Record<string, string>);

      // 2. Fetch & cache cross-reference bundle
      this.reportProgress('Loading Cross-Reference Network...', 45);
      const xrefData = await this.fetchWithCache<{ links?: CrossRefLink[] } | CrossRefLink[]>(xrefUrl);
      this.crossRefs = (xrefData as { links?: CrossRefLink[] }).links || (xrefData as CrossRefLink[]);

      // 3. Fetch & cache Hitchcock Bible Names Dictionary
      this.reportProgress('Loading Biblical Names & Entities...', 75);
      this.hitchcockNames = await this.fetchWithCache('/data/hitchcock_names.json');

      // 4. Fetch & cache theological audit relations
      this.reportProgress('Loading Theological Audit & Evidence...', 90);
      this.theologicalRelations = await this.fetchWithCache('/data/theological_relations.json');

      this.isReady = true;
      this.reportProgress('All Scripture & Reference Data Cached Locally', 100);
    } catch (err) {
      console.warn('LocalFirstStore initialized with fallback:', err);
      this.isReady = true;
    }
  }

  private reportProgress(msg: string, percent: number) {
    if (this.onProgress) {
      this.onProgress(msg, percent);
    }
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    // Try CacheStorage first (Native browser offline cache)
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName);
        const cachedRes = await cache.match(url);
        if (cachedRes) {
          return await cachedRes.json();
        }
        // Fetch from network, then store in cache
        const res = await fetch(url);
        if (res.ok) {
          cache.put(url, res.clone());
          return await res.json();
        }
      } catch (e) {
        console.warn(`CacheStorage access failed for ${url}, fetching direct:`, e);
      }
    }
    // Direct fetch fallback
    const res = await fetch(url);
    return await res.json();
  }

  /**
   * Fast local lookup of verse text (e.g. "John.3.16" or "Gen.1.1")
   */
  public getVerseText(osisRef: string): string {
    return this.kjvVerses[osisRef] || '';
  }

  /**
   * Fast local lookup of cross-references for any verse
   */
  public getCrossReferencesForVerse(osisRef: string): CrossRefLink[] {
    return this.crossRefs.filter(r => {
      const src = r.s || r.from;
      const tgt = r.t || r.to;
      return src === osisRef || tgt === osisRef;
    });
  }

  /**
   * Fast lookup of audited theological relation between two verses
   */
  public getTheologicalRelation(from: string, to: string): TheologicalRelation | null {
    const key1 = `${from}->${to}`;
    if (this.theologicalRelations[key1]) return this.theologicalRelations[key1];
    
    // Check range matches (e.g. "John.1.1-John.1.3")
    for (const [k, rel] of Object.entries(this.theologicalRelations)) {
      if (k.startsWith(from) && k.includes(to)) {
        return rel;
      }
    }
    return null;
  }

  /**
   * Fast lookup of Hitchcock name meaning
   */
  public getNameMeaning(name: string): HitchcockName | null {
    return this.hitchcockNames[name] || null;
  }
}

export const localStore = new LocalFirstStore();
