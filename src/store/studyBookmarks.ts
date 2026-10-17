/** Browser-owned study links, capped at 50; users can remove each saved entry. */
export const STUDY_BOOKMARK_KEY = 'historicalbible.study-bookmarks.v1';
export const MAX_STUDY_BOOKMARKS = 50;

export interface StudyBookmark { label: string; href: string; savedAt: string; }
export interface BookmarkStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }

function validBookmark(value: unknown): value is StudyBookmark {
  if (!value || typeof value !== 'object') return false;
  const item = value as StudyBookmark;
  if (typeof item.label !== 'string' || !item.label.trim() || item.label.length > 250) return false;
  if (typeof item.href !== 'string' || item.href.length > 4000 || !/^\/interact(?:\.html|\/)?\?/.test(item.href)) return false;
  const url = new URL(item.href, 'https://historicalbible.com');
  return url.origin === 'https://historicalbible.com' &&
    ['/interact', '/interact/', '/interact.html'].includes(url.pathname) &&
    Boolean(url.searchParams.get('name') || url.searchParams.get('figure')) &&
    typeof item.savedAt === 'string' && Number.isFinite(Date.parse(item.savedAt));
}

export function parseStudyBookmarks(raw: string | null): StudyBookmark[] {
  try {
    const data: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    return data.filter(validBookmark).filter(item => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    }).slice(0, MAX_STUDY_BOOKMARKS).map(({ label, href, savedAt }) => ({ label, href, savedAt }));
  } catch { return []; }
}

export function readStudyBookmarks(storage: BookmarkStorage): StudyBookmark[] {
  try { return parseStudyBookmarks(storage.getItem(STUDY_BOOKMARK_KEY)); } catch { return []; }
}

export function writeStudyBookmarks(storage: BookmarkStorage, entries: StudyBookmark[]): boolean {
  try {
    storage.setItem(STUDY_BOOKMARK_KEY, JSON.stringify(parseStudyBookmarks(JSON.stringify(entries))));
    return true;
  } catch { return false; }
}

export function addStudyBookmark(entries: StudyBookmark[], bookmark: StudyBookmark): StudyBookmark[] {
  // At capacity, keep existing studies; the UI asks the reader to remove one first.
  if (!validBookmark(bookmark)) return entries;
  const existing = entries.filter(entry => entry.href !== bookmark.href);
  if (existing.length >= MAX_STUDY_BOOKMARKS) return entries;
  return [bookmark, ...existing];
}
