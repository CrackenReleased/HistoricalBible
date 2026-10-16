/**
 * src/store/urlStateRouter.ts
 * Deep-linking and URL state synchronization for HistoricalBible.com/interact
 * Preserves clean shareable URLs (?figure=daniel, ?name=Gideon, ?ref=Dan.2.1, ?tab=connections)
 */

export interface InteractUrlState {
  figure?: string | null;
  name?: string | null;
  ref?: string | null;
  tab?: string | null;
  view?: 'list' | 'graph' | 'map' | null;
  hops?: 1 | 2;
}

export function readUrlState(): InteractUrlState {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const rawHops = Number(params.get('hops'));
  const rawView = params.get('view');
  return {
    figure: params.get('figure') || null,
    name: params.get('name') || null,
    ref: params.get('ref') || null,
    tab: params.get('tab') || null,
    view: rawView === 'graph' ? 'graph' : (rawView === 'map' ? 'map' : (rawView === 'list' ? 'list' : null)),
    hops: rawHops === 1 ? 1 : 2,
  };
}

export function writeUrlState(partial: Partial<InteractUrlState>, replace = false): InteractUrlState {
  if (typeof window === 'undefined') return {};
  const current = readUrlState();
  const next: InteractUrlState = { ...current, ...partial };
  const params = new URLSearchParams();

  if (next.figure) params.set('figure', next.figure);
  if (next.name) params.set('name', next.name);
  if (next.ref) params.set('ref', next.ref);
  if (next.tab) params.set('tab', next.tab);
  if (next.view) params.set('view', next.view);
  if (next.hops && next.hops === 1) params.set('hops', '1');

  const query = params.toString();
  const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;

  if (replace) {
    window.history.replaceState(next, '', newUrl);
  } else {
    if (window.location.search !== (query ? `?${query}` : '')) {
      window.history.pushState(next, '', newUrl);
    }
  }
  return next;
}

export function onUrlStateChange(callback: (state: InteractUrlState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(readUrlState());
  };
  window.addEventListener('popstate', handler);
  return () => window.removeEventListener('popstate', handler);
}
