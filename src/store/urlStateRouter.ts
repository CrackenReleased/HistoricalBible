/** Shareable Interact state. Restoration never pushes history entries. */
export interface InteractUrlState {
  figure?: string | null; name?: string | null; compare?: string | null; ref?: string | null;
  tab?: string | null; view?: 'list' | 'graph' | 'map' | null; hops?: 1 | 2;
  query?: string | null; book?: string | null; testament?: string | null;
  kind?: string | null; status?: string | null; sort?: string | null; page?: number;
  identity?: string | null; section?: string | null; studyPage?: number;
  occurrenceBook?: string | null; group?: string | null; context?: number;
  maxNodes?: number; minShared?: number; kinds?: string | null; labels?: string | null;
  sourceBook?: string | null; targetBook?: string | null; votes?: string | null;
  readerBook?: string | null; chapter?: number;
}
const stringKeys = ['figure','name','compare','ref','tab','view','query','book','testament','kind','status','sort','identity','section','occurrenceBook','group','kinds','labels','sourceBook','targetBook','votes','readerBook'] as const;
const numericDefaults = { page: 1, studyPage: 1, context: 0, hops: 2, maxNodes: 30, minShared: 1, chapter: 1 };
let restoring = 0;
export function restoreUrlState(run: () => void): void { restoring++; try { run(); } finally { restoring--; } }
export function readUrlState(): InteractUrlState {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const state: Record<string, unknown> = {};
  for (const key of stringKeys) state[key] = params.get(key)?.slice(0, 200) || null;
  for (const [key, fallback] of Object.entries(numericDefaults)) {
    const raw = params.get(key); const n = raw === null ? fallback : Number(raw);
    state[key] = Number.isFinite(n) ? Math.min(10000, Math.max(key === 'context' ? 0 : 1, Math.floor(n))) : fallback;
  }
  state.hops = state.hops === 1 ? 1 : 2;
  state.context = [0, 1, 3].includes(state.context as number) ? state.context : 0;
  state.maxNodes = [15, 30, 60].includes(state.maxNodes as number) ? state.maxNodes : 30;
  state.view = ['list','graph','map'].includes(String(state.view)) ? state.view : null;
  state.tab = ['books','references','names','connections','history'].includes(String(state.tab)) ? state.tab : null;
  return state as InteractUrlState;
}
export function writeUrlState(partial: Partial<InteractUrlState>, replace = false): InteractUrlState {
  if (typeof window === 'undefined') return {};
  if (restoring) return readUrlState();
  const next = { ...readUrlState(), ...partial };
  const params = new URLSearchParams();
  for (const key of stringKeys) if (next[key]) params.set(key, String(next[key]));
  for (const [key, fallback] of Object.entries(numericDefaults)) {
    const value = next[key as keyof InteractUrlState];
    if (value != null && value !== fallback) params.set(key, String(value));
  }
  const query = params.toString();
  const url = window.location.pathname + (query ? `?${query}` : '');
  if (window.location.pathname + window.location.search !== url) {
    window.history[replace ? 'replaceState' : 'pushState'](next, '', url);
    window.dispatchEvent(new Event('interact-state-change'));
  }
  return next;
}
export function onUrlStateChange(callback: (state: InteractUrlState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => { restoreUrlState(() => callback(readUrlState())); window.dispatchEvent(new Event('interact-state-change')); };
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}
